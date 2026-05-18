const API_URL = "https://script.google.com/macros/s/AKfycbxyorkmL2NdW9EomNQQaobBj0SbJEyPThCM3yRWqWHUgP2Hbuyxbke7aIiRYrMRDhnKbQ/exec";

window.onload = async function () {

  const container = document.getElementById("jobs");

  try {

    const response = await fetch(API_URL);

    const data = await response.json();

    container.innerHTML = "";

    data.forEach(job => {

      const card = document.createElement("div");

      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.margin = "10px";

      card.innerHTML = `
        <h3>${job.customer}</h3>
        <p>Status: ${job.status}</p>
        <p>Job ID: ${job.jobId}</p>
        <p>Revenue: $${job.revenue}</p>
      `;

      container.appendChild(card);

    });

  } catch (error) {

    console.error(error);

    container.innerHTML = `
      <h2>Error loading jobs</h2>
      <p>Check script.js API URL</p>
    `;

  }

};