const API_URL = "https://script.google.com/macros/s/AKfycbxyorkmL2NdW9EomNQQaobBj0SbJEyPThCM3yRWqWHUgP2Hbuyxbke7aIiRYrMRDhnKbQ/exec";
async function updateStatus(jobId, status) {

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "updateStatus",
      jobId,
      status
    })
  });

  loadJobs();
}

window.onload = async function () {
  loadJobs();
};


async function loadJobs() {

  const container = document.getElementById("jobs");

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    const searchValue = document
      const statusFilter = document
  .getElementById("statusFilter")
  .value;
  .getElementById("searchInput")
  .value
  .toLowerCase();

const filteredData = data.filter(job => {

  const matchesSearch = job.customer
    .toLowerCase()
    .includes(searchValue);

  const matchesStatus =
    statusFilter === "All" ||
    job.status === statusFilter;

  return matchesSearch && matchesStatus;
});
    async function deleteJob(jobId) {

  if (!confirm("Delete this job?")) return;

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "delete",
      jobId: jobId
    })
  });

  loadJobs();
}

    let totalRevenue = 0;
let completedJobs = 0;
let scheduledJobs = 0;

filteredData.forEach(job => {

  totalRevenue += Number(job.revenue) || 0;

  if (job.status === "Completed") {
    completedJobs++;
  }

  if (job.status === "Scheduled") {
    scheduledJobs++;
  }

});

document.getElementById("totalRevenue").innerText =
  "$" + totalRevenue.toLocaleString();

document.getElementById("totalJobs").innerText =
  data.length;

document.getElementById("completedJobs").innerText =
  completedJobs;

document.getElementById("scheduledJobs").innerText =
  scheduledJobs;

    container.innerHTML = "";

    data.forEach(job => {

      const card = document.createElement("div");

      card.className = "job-card";

      card.innerHTML =
        <button onclick="deleteJob('${job.jobId}')">
  Delete
</button>`
        <h3>${job.customer}</h3>
        <p>
  <span class="status-badge ${job.status.toLowerCase()}">
    ${job.status}
  </span>
</p>
        <p><strong>Job ID:</strong> ${job.jobId}</p>
        <p><strong>Revenue:</strong> $${job.revenue}</p>
      `;

      container.appendChild(card);

    });

  } catch (error) {

    console.error("ERROR:", error);

    container.innerHTML = `
      <h2>Error loading jobs</h2>
      <p>Check console for details</p>
    `;

  }

}

async function createJob() {

  const customer = document.getElementById("customer").value;

  const email = document.getElementById("email").value;

  const revenue = document.getElementById("revenue").value;

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        customer,
        email,
        revenue
      })
    });

    document.getElementById("customer").value = "";
    document.getElementById("email").value = "";
    document.getElementById("revenue").value = "";

    loadJobs();

  } catch (error) {

    console.error("Create Job Error:", error);

  }

}
