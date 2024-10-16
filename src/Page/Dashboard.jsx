import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import Navbar from "../Components/Navbar";
import CustomSpinner from "../Components/CustomSpinner";
import dot from "../Assets/icons_FEtask/3 dot menu.svg"
import add from "../Assets/icons_FEtask/add.svg";
import Todo from "../Assets/icons_FEtask/Todo.svg";
import progress from "../Assets/icons_FEtask/progress.svg";
import Backlog from "../Assets/icons_FEtask/Backlog.svg";
import Done from "../Assets/icons_FEtask/Done.svg";
import Cancelled from "../Assets/icons_FEtask/Cancelled.svg";
import { FETCH_URL } from "../FETCH_URL";

import High from "../Assets/icons_FEtask/HighPriority.svg"
import Low from "../Assets/icons_FEtask/LowPriority.svg";
import Medium from "../Assets/icons_FEtask/MediumPriority.svg"
import noPriority from "../Assets/icons_FEtask/Nopriority.svg"
import Urgent from "../Assets/icons_FEtask/UrgentPrioritycolour.svg"


const Dashboard = () => {
  // State Variables
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [user, setUser] = useState({});
  const [priority, setPriority] = useState({});
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");
  const [availableUser, setAvailableUser] = useState({});
  const [statusMapping, setStatusMapping] = useState({});
  const statusKeys = ["Backlog", "Todo", "In progress", "Done", "Canceled"];

  // Fetch Data 
  useEffect(() => {
    getData();
  }, [grouping, ordering]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 0:
        return noPriority;
      case 1:
        return Urgent;
      case 2:
        return High;
      case 3:
        return Medium;
      case 4:
        return Low;
      default:
        return noPriority;  // Handle unexpected values
    }
  };

  const getPriorityLabel = (priority)=> {
    switch(priority){
      case 0:
        return "No Priority";
      case 1:
        return "Urgent";
      case 2:
        return "High";
      case 3:
        return "Medium";
      case 4:
        return "Low";
      default:
        return noPriority;      
    }
  }


  const sortByTitle = (tickets) => {
    return tickets.sort((a, b) => a.title.localeCompare(b.title));
  };

  // Grouping the data by Status
  const groupByStatus = (tickets) => {
    let sortedTickets = tickets;

    if (ordering === "title") {
      sortedTickets = sortByTitle(tickets);
    }

    const grouped = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = [];
      }
      acc[ticket.status].push(ticket);
      return acc;
    }, {});

    statusKeys.forEach((key) => {
      if (!grouped[key]) {
        grouped[key] = [];
      }
    });

    if (ordering === "priority") {
      for (let key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    }

    return {
      Keys: statusKeys,
      ...grouped,
    };
  };

  // Grouping the data by Priority
  const groupByPriority = (tickets) => {
    let sortedTickets = tickets;

    if (ordering === "title") {
      sortedTickets = sortByTitle(tickets);
    }

    const priorityObject = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.priority]) {
        acc[ticket.priority] = [];
      }
      acc[ticket.priority].push(ticket);
      return acc;
    }, {});

    return {
      Keys: Object.keys(priorityObject),
      ...priorityObject,
    };
  };

  // Grouping the data by users
  const groupByUser = (tickets) => {
    let sortedTickets = tickets;

    if (ordering === "title") {
      sortedTickets = sortByTitle(tickets);
    }

    const grouped = sortedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.userId]) {
        acc[ticket.userId] = [];
      }
      acc[ticket.userId].push(ticket);
      return acc;
    }, {});

    if (ordering === "priority") {
      for (let key in grouped) {
        grouped[key].sort((a, b) => b.priority - a.priority);
      }
    }

    return {
      Keys: userData.map((user) => user.id.toString()),
      ...grouped,
    };
  };

  // Available User (online/offline) 
  const availabilityMap = (users) => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.available;
      return acc;
    }, {});
  };

  // Work Status
  const extractStatusMapping = (data) => {
    const statusMapping = {};

    data.tickets.forEach((ticket) => {
      statusMapping[ticket.id] = ticket.status;
    });

    return statusMapping;
  };

  // Fetch API function
  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(FETCH_URL);
      const data = await response.json();
      setIsLoading(false);
      setUserData(data.users);
      setUser(groupByUser(data.tickets));
      setStatus(groupByStatus(data.tickets));
      setPriority(groupByPriority(data.tickets));
      setAvailableUser(availabilityMap(data.users));
      setStatusMapping(extractStatusMapping(data));
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  // Function to get initials from the name
  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0)).join("").toUpperCase();
    return initials;
  };

  if (grouping === "status") {
    return (
      <>
        <div>
          <Navbar
            grouping={grouping}
            setGrouping={setGrouping}
            ordering={ordering}
            setOrdering={setOrdering}
            call={getData}
          />
          <div className="Dashboard-Container">
            {isLoading ? (
              <CustomSpinner />
            ) : (
              <>
                {status.Keys.map((item, index) => (
                  <div className="column" key={index}>
                    <div className="Header">
                      <div className="icon-text">
                        {item === "Todo" ? (
                          <img src={Todo} height="20px" width="20px" id="todo"/>
                        ) : item === "In progress" ? (
                          <img src={progress} height="20px" width="20px" id="todo"/>
                        ) : item === "Backlog" ? (
                          <img src={Backlog} height="20px" width="20px" id="backlog"/>
                        ) : item === "Done" ? (
                          <img src={Done} height="20px" width="20px" id="done"/>
                        ) : (
                          <img src={Cancelled} height="20px" width="20px" id="cancel"/>
                        )}
                        <span className="text">
                          {item === "In progress" ? "In Progress" : item}
                        </span>
                        <span>{status[item]?.length}</span>
                      </div>
                      <div className="actions">
                      <img src={add} height="20px" width="20px" id="add"/>
                      <img src={dot} height="20px" width="20px" id="dots"/>
                      </div>
                    </div>
                    {status[item] &&
                      status[item].map((value) => {
                        return (
                          <Card
                            id={value.id}
                            title={value.title}
                            tag={value.tag}
                            userId={value.userId}
                            status={status}
                            userData={userData}
                            priority={value.priority}
                            key={value.id}
                            grouping={grouping}
                            ordering={ordering}
                            statusMapping={statusMapping}
                          />
                        );
                      })}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );
  } else if (grouping === "users") {
    return (
      <>
        <div>
          <Navbar
            grouping={grouping}
            setGrouping={setGrouping}
            ordering={ordering}
            setOrdering={setOrdering}
            call={getData}
          />
          <div className="Dashboard-Container">
            {isLoading ? (
              <CustomSpinner />
            ) : (
              <>
                {availableUser &&
                  user.Keys.map((userId, index) => {
                    const currentUserName =
                      userData.find((u) => u.id.toString() === userId)?.name ||
                      "Unknown";
                    return (
                      <div className="column" key={index}>
                        <div className="Header">
                          <div className="icon-text">
                            <div
                              className={`user-avatar ${
                                String(availableUser[userId]) === "false"
                                  ? "user-avatar-unavailable"
                                  : ""
                              }`}
                            >
                              <span className="initials">
                                {getInitials(currentUserName)}
                              </span>
                            </div>
                            <span className="text">{currentUserName}</span>
                            <span>{user[userId]?.length}</span>
                          </div>
                          <div className="actions">
                          <img src={add} height="20px" width="20px" id="todo"/>
                          <img src={dot} height="20px" width="20px" id="dots"/>
                          </div>
                        </div>
                        {user[userId] &&
                          user[userId].map((ticket) => {
                            return (
                              <Card
                                id={ticket.id}
                                title={ticket.title}
                                tag={ticket.tag}
                                userId={ticket.userId}
                                userData={userData}
                                priority={ticket.priority}
                                key={ticket.id}
                                grouping={grouping}
                                ordering={ordering}
                                status={status}
                                statusMapping={statusMapping}
                              />
                            );
                          })}
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <Navbar
            grouping={grouping}
            setGrouping={setGrouping}
            ordering={ordering}
            setOrdering={setOrdering}
            call={getData}
          />
          <div className="Dashboard-Container">
            {isLoading ? (
              <CustomSpinner />
            ) : (
              <>
                {priority.Keys.map((item, index) => (
                  <div className="column" key={index}>
                    <div className="Header">
                      <div className="icon-text">
                      <img
                        src={getPriorityIcon(Number(item))}
                        alt="priority icon"
                        height="20px"
                        width="20px"
                      />
                      <span className="text">{getPriorityLabel(Number(item))}</span>
                        <span>{priority[item]?.length}</span>
                      </div>
                      <div className="actions">
                      <img src={add} height="20px" width="20px" id="todo"/>
                      <img src={dot} height="20px" width="20px" id="dots"/>
                      </div>
                    </div>
                    {priority[item] &&
                      priority[item].map((value) => {
                        return (
                          <Card
                            id={value.id}
                            title={value.title}
                            tag={value.tag}
                            userId={value.userId}
                            userData={userData}
                            priority={value.priority}
                            key={value.id}
                            grouping={grouping}
                            ordering={ordering}
                            status={status}
                            statusMapping={statusMapping}
                          
                          
                          >
                            
           
                            </Card>
                          
                        );
                      })}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default Dashboard;
