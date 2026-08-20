import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import Invoice from "../models/invoiceModel.js";
import Client from "../models/clientModel.js";
import Lead from "../models/leadModel.js";
import BlogPost from "../models/blogPostModel.js";
import CaseStudy from "../models/casestudyModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const globalSearch = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const role = req.user.role; // "admin" or "client"

  if (!q || q.length < 2) {
    return res.status(200).json({ results: {} });
  }

  const regex = new RegExp(q, "i");
  const results = {};

  if (role === "admin") {
    // Admin can search everything
    const [projects, tasks, invoices, clients, leads, blogs, casestudies] = await Promise.all([
      Project.find({ title: regex }).select("title status phase _id").limit(5),
      Task.find({ title: regex }).select("title status _id").limit(5),
      Invoice.find({ invoiceNumber: regex }).select("invoiceNumber status totalAmount _id").limit(5),
      Client.find({ $or: [{ companyName: regex }, { contactName: regex }] }).select("companyName contactName _id").limit(5),
      Lead.find({ $or: [{ name: regex }, { company: regex }] }).select("name company _id").limit(5),
      BlogPost.find({ title: regex }).select("title status _id").limit(5),
      CaseStudy.find({ title: regex }).select("title _id").limit(5),
    ]);

    results.projects = projects;
    results.tasks = tasks;
    results.invoices = invoices;
    results.clients = clients;
    results.leads = leads;
    results.blogs = blogs;
    results.casestudies = casestudies;
  } else if (role === "client") {
    // Clients can only search their own projects, tasks, and invoices
    const clientId = req.user._id;

    const clientProjects = await Project.find({ clientId: clientId, title: regex }).select("title status phase _id").limit(5);
    
    // Find client's invoices
    const clientInvoices = await Invoice.find({ clientId: clientId, invoiceNumber: regex }).select("invoiceNumber status totalAmount _id").limit(5);

    results.projects = clientProjects;
    results.invoices = clientInvoices;

    const allClientProjects = await Project.find({ clientId: clientId }).select("_id");
    const projectIds = allClientProjects.map((p) => p._id);
    
    const clientTasks = await Task.find({ 
      projectId: { $in: projectIds }, 
      title: regex 
    }).select("title status _id").limit(5);

    results.tasks = clientTasks;
  }

  res.status(200).json({ results });
});
