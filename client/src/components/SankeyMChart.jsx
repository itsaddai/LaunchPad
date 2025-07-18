import React, { useEffect, useState } from "react";
import { ResponsiveContainer, Sankey, Tooltip, Label } from "recharts";

// status colors 
const STATUS_COLORS = {
  Rejected: "#e74c3c",      // red
  Ghosted: "#7f8c8d",       // grey
  Interviewing: "#27ae60",  // green
  "Offer Received": "#2980b9", // blue
  "Unknown Status": "#bdc3c7", // light grey something..
};

const buildSankeyData = (applications) => {
  if (!applications || applications.length === 0) return null;

  const nodes = [{ name: "Applications" }];


  const statuses = Array.from(
    new Set(applications.map((app) => app.status || "Unknown Status"))
  );

  // statuses as right nodes
  statuses.forEach((status) => nodes.push({ name: status }));

  const nameToIndex = {};
  nodes.forEach((node, i) => {
    nameToIndex[node.name] = i;
  });

  // count applications for each status
  const statusCounts = {};
  applications.forEach((app) => {
    const status = app.status || "Unknown Status";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const links = statuses.map((status, idx) => ({
    source: 0,
    target: nameToIndex[status],
    value: statusCounts[status],
    key: `link-${idx}`,
    color: STATUS_COLORS[status] || STATUS_COLORS["Unknown Status"],
  }));

  const nodesWithKeys = nodes.map((node, idx) => ({
    ...node,
    key: `node-${idx}`,
  }));

  return { nodes: nodesWithKeys, links };
};

const SankeyMChart = ({ applications }) => {
  const data = buildSankeyData(applications);

  if (!data) {
    return (
      <div className="text-center py-10 text-gray-600 italic">
        No application data available to display the flow chart...
        Get to applying! 
      </div>
    );
  }

  const totalApps = applications.length;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <Sankey
          data={data}
          nodePadding={30}
          nodeWidth={20}
          style={{ fontSize: 14 }}
          nodes={data.nodes.map((node) => ({
            ...node,
            key: node.key,
            fill: node.name === "Applications" ? "#34495e" : "#ccc",
            stroke: "#555",
          }))}
          links={data.links.map((link) => ({
            ...link,
            key: link.key,
            stroke: link.color,
            fill: link.color,
          }))}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                if (!item) return null;

                // Detect if hovering on node or link
                if ("source" in item && "target" in item) {
                  // Hovering on link
                  const sourceName = data.nodes[item.source]?.name;
                  const targetName = data.nodes[item.target]?.name;
                  return (
                    <div
                      style={{
                        backgroundColor: "white",
                        padding: 8,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        fontSize: 14,
                        minWidth: 140,
                      }}
                    >
                      <strong>
                        {sourceName} → {targetName}
                      </strong>
                      <br />
                      Applications: {item.value}
                    </div>
                  );

                } else if ("name" in item) {
                  if (item.name === "Applications") {
                    return (
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: 8,
                          border: "1px solid #ccc",
                          borderRadius: 4,
                          fontSize: 14,
                          minWidth: 140,
                        }}
                      >
                        <strong>Total applications</strong>
                        <br />
                        {totalApps}
                      </div>
                    );
                  } 
                  else {
                    const count =
                      applications.filter(
                        (app) => (app.status || "Unknown Status") === item.name
                      ).length || 0;

                    return (
                      <div
                        style={{
                          backgroundColor: "white",
                          padding: 8,
                          border: "1px solid #ccc",
                          borderRadius: 4,
                          fontSize: 14,
                          minWidth: 140,
                        }}
                      >
                        <strong>{item.name}</strong>
                        <br />
                        Applications: {count}
                      </div>
                    );
                  }
                }
              }
              return null;
            }}
          />
          <Label
            value="Applications Flow: Total → Status"
            position="top"
            offset={10}
            style={{ fontWeight: "bold" }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
};

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No auth token found, cannot fetch applications");
      setApplications([]);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then((data) => {
        setApplications(data);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        setApplications([]);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <SankeyMChart applications={applications} />
    </div>
  );
};

export default Dashboard;
