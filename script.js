const API_URL =
  "https://script.google.com/macros/s/AKfycbxyorkmL2NdW9EomNQQaobBj0SbJEyPThCM3yRWqWHUgP2Hbuyxbke7aIiRYrMRDhnKbQ/exec";

window.onload = function () {
  loadJobs();
};

async function loadJobs() {

  const container =
    document.getElementById("jobs");

  try {

    const response =
      await fetch(API_URL);

    const data =
      await response.json();

    const searchValue =
      document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const statusFilter =
      document
        .getElementById("statusFilter")
        .value;

    const techFilter =
  document
    .getElementById("techFilter")
    .value;

const filteredData =
  data.filter(job => {

    const matchesSearch =
      job.customer
        .toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      job.status === statusFilter;

    const matchesTech =
      techFilter === "All" ||
      job.tech === techFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesTech
    );

  });
      });

    /*
      =====================
      SUMMARY TOTALS
      =====================
    */

    let totalRevenue = 0;
    let completedJobs = 0;
    let scheduledJobs = 0;

    filteredData.forEach(job => {

      totalRevenue +=
        Number(job.revenue) || 0;

      if (job.status === "Completed") {
        completedJobs++;
      }

      if (job.status === "Scheduled") {
        scheduledJobs++;
      }

    });

    document.getElementById(
      "totalRevenue"
    ).innerText =
      "$" + totalRevenue.toLocaleString();

    document.getElementById(
      "totalJobs"
    ).innerText =
      filteredData.length;

    document.getElementById(
      "completedJobs"
    ).innerText =
      completedJobs;

    document.getElementById(
      "scheduledJobs"
    ).innerText =
      scheduledJobs;

    /*
      =====================
      BUILD JOB CARDS
      =====================
    */

    container.innerHTML = "";

    filteredData.forEach(job => {

      const card =
        document.createElement("div");

      card.className = "job-card";

      card.innerHTML = `

        <h3>${job.customer}</h3>

        <p>
          <span class="status-badge ${job.status.toLowerCase()}">
            ${job.status}
          </span>
        </p>

        <p>
          <strong>Job ID:</strong>
          ${job.jobId}
        </p>

        <p>
  <strong>Revenue:</strong>
  $${job.revenue}
</p>

<p>
  <strong>Assigned Tech:</strong>
  ${job.tech || "Unassigned"}
</p>

<button
  onclick="updateStatus('${job.jobId}', 'Completed')"
>
  Mark Complete
</button>

        <p>
          <strong>Technician:</strong>
          ${job.tech || "Unassigned"}
        </p>

        <select
          onchange="assignTech('${job.jobId}', this.value)"
        >

          <option value="">
            Assign Tech
          </option>

          <option value="Jeremiah">
            Jeremiah
          </option>

          <option value="Mike">
            Mike
          </option>

          <option value="Chris">
            Chris
          </option>

        </select>

        <br><br>

        <select
          onchange="updateStatus('${job.jobId}', this.value)"
        >

          <option value="">
            Update Status
          </option>

          <option value="Scheduled">
            Scheduled
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Invoiced">
            Invoiced
          </option>

        </select>

        <br><br>

        <button
          onclick="deleteJob('${job.jobId}')"
        >
          Delete
        </button>

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

/*
  =====================
  CREATE JOB
  =====================
*/

async function createJob() {

  const customer =
    document.getElementById("customer").value;

  const email =
    document.getElementById("email").value;

  const revenue =
    document.getElementById("revenue").value;

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

    console.error(
      "Create Job Error:",
      error
    );

  }

}

/*
  =====================
  ASSIGN TECH
  =====================
*/

async function assignTech(jobId, tech) {

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "assignTech",
        jobId,
        tech
      })
    });

    loadJobs();

  } catch (error) {

    console.error(
      "Assign Tech Error:",
      error
    );

  }

}

/*
  =====================
  UPDATE STATUS
  =====================
*/

async function updateStatus(jobId, status) {

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "updateStatus",
        jobId,
        status
      })
    });

    loadJobs();

  } catch (error) {

    console.error(
      "Update Status Error:",
      error
    );

  }

}

/*
  =====================
  DELETE JOB
  =====================
*/

async function deleteJob(jobId) {

  if (!confirm("Delete this job?")) {
    return;
  }

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "delete",
        jobId
      })
    });

    loadJobs();

  } catch (error) {

    console.error(
      "Delete Job Error:",
      error
    );

  }

}
