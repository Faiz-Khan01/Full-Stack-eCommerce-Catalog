import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://full-stack-ecommerce-catalog.onrender.com/api";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Tickets" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

// =========================================================
// STYLES
// =========================================================

const inputStyle = {
  background: "var(--input-bg, #1f2937)",
  color: "var(--text-primary, #f8fafc)",
  border: "1px solid var(--border, #374151)",
};

const selectStyle = {
  ...inputStyle,
};

const paginationButtonStyle = {
  minWidth: "38px",
  background: "var(--card, #111827)",
  color: "var(--text-secondary, #94a3b8)",
  border: "1px solid var(--border, #374151)",
};

// =========================================================
// SUB-COMPONENTS (Hoisted to prevent blank screen render bugs)
// =========================================================

const StatCard = ({ title, value, color, icon }) => (
  <div className="col-6 col-lg">
    <div
      className="p-4 rounded-4 h-100"
      style={{
        background: "var(--card, #111827)",
        border: "1px solid var(--border, #1f2937)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div
            className="small mb-2"
            style={{
              color: "var(--text-secondary, #94a3b8)",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${color}18`,
            color,
            fontSize: "20px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const Badge = ({ color, label }) => (
  <span
    className="badge rounded-pill"
    style={{
      background: `${color}18`,
      color,
      padding: "8px 12px",
      fontWeight: 700,
    }}
  >
    {label}
  </span>
);

const InfoItem = ({ label, value }) => (
  <div className="col-md-6">
    <div
      className="p-3 rounded-3 h-100"
      style={{
        background: "rgba(255,255,255,.02)",
        border: "1px solid var(--border, #1f2937)",
      }}
    >
      <div
        className="small mb-1"
        style={{
          color: "var(--text-secondary, #94a3b8)",
        }}
      >
        {label}
      </div>

      <div
        className="fw-semibold"
        style={{
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <div
    className="small fw-bold mb-2"
    style={{
      color: "var(--text-secondary, #94a3b8)",
      letterSpacing: ".5px",
    }}
  >
    {children}
  </div>
);

const LoadingState = () => (
  <div
    className="text-center py-5"
    style={{
      color: "var(--text-secondary, #94a3b8)",
    }}
  >
    <div
      className="spinner-border mb-3"
      style={{
        color: "#10b981",
      }}
    />

    <div>Loading support tickets...</div>
  </div>
);

const EmptyState = ({ searching }) => (
  <div
    className="text-center p-5 rounded-4"
    style={{
      background: "var(--card, #111827)",
      border: "1px solid var(--border, #1f2937)",
    }}
  >
    <div
      style={{
        fontSize: "50px",
      }}
    >
      {searching ? "🔎" : "📭"}
    </div>

    <h5 className="fw-bold mt-3">
      {searching ? "No matching tickets" : "No support tickets"}
    </h5>

    <p
      className="mb-0"
      style={{
        color: "var(--text-secondary, #94a3b8)",
      }}
    >
      {searching
        ? "Try another search term."
        : "There are no tickets for this filter."}
    </p>
  </div>
);

const TicketTable = ({
  tickets,
  onView,
  getCustomerName,
  getCustomerEmail,
  statusColor,
  priorityColor,
  formatDate,
}) => (
  <div
    className="rounded-4 overflow-hidden"
    style={{
      background: "var(--card, #111827)",
      border: "1px solid var(--border, #1f2937)",
    }}
  >
    <div className="table-responsive">
      <table
        className="table mb-0 align-middle"
        style={{
          color: "var(--text-primary, #f8fafc)",
        }}
      >
        <thead>
          <tr
            style={{
              background: "rgba(255,255,255,.02)",
              borderBottom: "1px solid var(--border, #1f2937)",
            }}
          >
            <th className="px-4 py-3">Ticket</th>
            <th className="py-3">Customer</th>
            <th className="py-3">Category</th>
            <th className="py-3">Priority</th>
            <th className="py-3">Status</th>
            <th className="py-3">Created</th>
            <th className="py-3 text-end px-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              style={{
                borderBottom: "1px solid var(--border, #1f2937)",
              }}
            >
              <td className="px-4">
                <div
                  style={{
                    color: "#10b981",
                    fontWeight: 700,
                  }}
                >
                  #{ticket.id}
                </div>

                <div
                  className="text-truncate"
                  style={{
                    maxWidth: "240px",
                    fontWeight: 600,
                  }}
                >
                  {ticket.subject || "No subject"}
                </div>
              </td>

              <td>
                <div className="fw-semibold">
                  {getCustomerName(ticket)}
                </div>

                <div
                  style={{
                    color: "var(--text-secondary, #94a3b8)",
                    fontSize: "13px",
                  }}
                >
                  {getCustomerEmail(ticket)}
                </div>
              </td>

              <td>
                <Badge
                  color="#3b82f6"
                  label={ticket.category || "General"}
                />
              </td>

              <td>
                <Badge
                  color={priorityColor(ticket.priority)}
                  label={ticket.priority || "NORMAL"}
                />
              </td>

              <td>
                <Badge
                  color={statusColor(ticket.status)}
                  label={ticket.status || "OPEN"}
                />
              </td>

              <td
                style={{
                  color: "var(--text-secondary, #94a3b8)",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDate(ticket.createdAt)}
              </td>

              <td className="text-end px-4">
                <button
                  onClick={() => onView(ticket)}
                  className="btn btn-sm rounded-3"
                  style={{
                    background: "rgba(16,185,129,.12)",
                    color: "#34d399",
                    border: "1px solid rgba(16,185,129,.25)",
                    fontWeight: 600,
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const TicketModal = ({
  ticket,
  loading,
  updating,
  reply,
  setReply,
  sendingReply,
  deleting,
  showDeleteConfirm,
  setShowDeleteConfirm,
  onClose,
  onStatusChange,
  onPriorityChange,
  onSendReply,
  onDelete,
  getCustomerName,
  getCustomerEmail,
  getCustomerPhone,
  formatDate,
  formatStatus,
  formatPriority,
  statusColor,
  priorityColor,
  currentAdmin,
}) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.78)",
      backdropFilter: "blur(5px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="rounded-4"
      style={{
        width: "100%",
        maxWidth: "820px",
        maxHeight: "92vh",
        overflowY: "auto",
        background: "var(--card, #111827)",
        border: "1px solid var(--border, #1f2937)",
        boxShadow: "0 25px 80px rgba(0,0,0,.6)",
      }}
    >
      {/* HEADER */}
      <div
        className="d-flex justify-content-between align-items-start p-4"
        style={{
          borderBottom: "1px solid var(--border, #1f2937)",
          position: "sticky",
          top: 0,
          background: "var(--card, #111827)",
          zIndex: 2,
        }}
      >
        <div>
          <div
            style={{
              color: "#10b981",
              fontWeight: 700,
            }}
          >
            Ticket #{ticket.id}
          </div>

          <h4 className="fw-bold mb-2 mt-1">
            {ticket.subject || "Support Request"}
          </h4>

          <div className="d-flex gap-2 flex-wrap">
            <Badge
              color={statusColor(ticket.status)}
              label={formatStatus(ticket.status)}
            />

            <Badge
              color={priorityColor(ticket.priority)}
              label={formatPriority(ticket.priority)}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn btn-sm rounded-circle"
          style={{
            width: "38px",
            height: "38px",
            color: "var(--text-secondary, #94a3b8)",
            background: "var(--input-bg, #1f2937)",
            border: "1px solid var(--border, #374151)",
            fontSize: "22px",
          }}
        >
          ×
        </button>
      </div>

      {/* BODY */}
      <div className="p-4">
        {loading && (
          <div
            className="text-center py-3"
            style={{
              color: "var(--text-secondary, #94a3b8)",
            }}
          >
            Loading complete ticket details...
          </div>
        )}

        {/* CUSTOMER */}
        <div className="mb-4">
          <SectionTitle>Customer</SectionTitle>

          <div className="row g-3">
            <InfoItem
              label="Name"
              value={getCustomerName(ticket)}
            />

            <InfoItem
              label="Email"
              value={getCustomerEmail(ticket)}
            />

            <InfoItem
              label="Phone"
              value={getCustomerPhone(ticket)}
            />

            <InfoItem
              label="Category"
              value={ticket.category || "General"}
            />
          </div>
        </div>

        {/* DATES */}
        <div className="row g-3 mb-4">
          <InfoItem
            label="Created"
            value={formatDate(ticket.createdAt)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(ticket.updatedAt)}
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-4">
          <SectionTitle>Customer Message</SectionTitle>

          <div
            className="p-3 rounded-3"
            style={{
              background: "var(--input-bg, #1f2937)",
              border: "1px solid var(--border, #1f2937)",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {ticket.message || "No message provided."}
          </div>
        </div>

        {/* ADMIN CONTROLS */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="small fw-bold mb-2 d-block">
              STATUS
            </label>

            <select
              className="form-select"
              value={ticket.status || "OPEN"}
              disabled={updating}
              onChange={(e) =>
                onStatusChange(ticket.id, e.target.value)
              }
              style={selectStyle}
            >
              {STATUS_OPTIONS.filter(
                ({ value }) => value !== "ALL"
              ).map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="small fw-bold mb-2 d-block">
              PRIORITY
            </label>

            <select
              className="form-select"
              value={ticket.priority || "NORMAL"}
              disabled={updating}
              onChange={(e) =>
                onPriorityChange(ticket.id, e.target.value)
              }
              style={selectStyle}
            >
              {PRIORITY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* REPLY */}
        <div className="mb-4">
          <SectionTitle>Reply to Customer</SectionTitle>

          <textarea
            className="form-control"
            rows={5}
            placeholder="Write a response to the customer..."
            value={reply}
            disabled={sendingReply}
            onChange={(e) => setReply(e.target.value)}
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />

          <div className="d-flex justify-content-between align-items-center mt-2">
            <small
              style={{
                color: "var(--text-secondary, #94a3b8)",
              }}
            >
              {currentAdmin?.name
                ? `Replying as ${currentAdmin.name}`
                : "Replying as admin"}
            </small>

            <button
              onClick={onSendReply}
              disabled={sendingReply || !reply.trim()}
              className="btn rounded-3 px-4"
              style={{
                background: "#10b981",
                color: "#fff",
                border: "none",
                fontWeight: 700,
              }}
            >
              {sendingReply ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>

        {/* DELETE */}
        <div
          className="pt-3"
          style={{
            borderTop: "1px solid var(--border, #1f2937)",
          }}
        >
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-outline-danger rounded-3"
            >
              🗑 Delete Ticket
            </button>
          ) : (
            <div
              className="p-3 rounded-3"
              style={{
                background: "rgba(239,68,68,.08)",
                border: "1px solid rgba(239,68,68,.25)",
              }}
            >
              <div className="fw-bold mb-1">Delete this ticket?</div>

              <div
                className="small mb-3"
                style={{
                  color: "var(--text-secondary, #94a3b8)",
                }}
              >
                This action cannot be undone.
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-danger rounded-3"
                  disabled={deleting}
                  onClick={onDelete}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </button>

                <button
                  className="btn btn-sm rounded-3"
                  disabled={deleting}
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    background: "var(--input-bg, #1f2937)",
                    color: "var(--text-primary, #f8fafc)",
                    border: "1px solid var(--border, #374151)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  return (
    <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
      <button
        className="btn btn-sm rounded-3"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={paginationButtonStyle}
      >
        ←
      </button>

      {start > 1 && (
        <>
          <button
            className="btn btn-sm rounded-3"
            onClick={() => onPageChange(1)}
            style={paginationButtonStyle}
          >
            1
          </button>

          {start > 2 && (
            <span
              style={{
                color: "var(--text-secondary, #94a3b8)",
              }}
            >
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className="btn btn-sm rounded-3"
          onClick={() => onPageChange(page)}
          style={{
            ...paginationButtonStyle,
            background:
              page === currentPage
                ? "#10b981"
                : "var(--card, #111827)",
            color:
              page === currentPage
                ? "#fff"
                : "var(--text-secondary, #94a3b8)",
          }}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span
              style={{
                color: "var(--text-secondary, #94a3b8)",
              }}
            >
              ...
            </span>
          )}

          <button
            className="btn btn-sm rounded-3"
            onClick={() => onPageChange(totalPages)}
            style={paginationButtonStyle}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className="btn btn-sm rounded-3"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={paginationButtonStyle}
      >
        →
      </button>
    </div>
  );
};

// =========================================================
// API HELPER
// =========================================================

const getStoredToken = () => {
  const possibleKeys = [
    "token",
    "accessToken",
    "jwt",
    "authToken",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  return null;
};

const apiRequest = async (
  endpoint,
  options = {},
  token = null
) => {
  const authToken = token || getStoredToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : {
        "Content-Type": "application/json",
      }),
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let result = null;
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    const text = await response.text();
    result = text ? { message: text } : null;
  }

  if (!response.ok) {
    const error = new Error(
      result?.message ||
      result?.error ||
      `Request failed with status ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  return result;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const AdminSupportTickets = () => {
  const auth = useAuth();

  const user = auth?.user;
  const authToken =
    auth?.token ||
    auth?.accessToken ||
    auth?.jwt ||
    getStoredToken();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] =
    useState(null);
  const [loadingDetails, setLoadingDetails] =
    useState(false);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] =
    useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  // =========================================================
  // LOAD TICKETS
  // =========================================================

  const fetchTickets = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const endpoint =
          filter === "ALL"
            ? "/support/admin/tickets"
            : `/support/admin/tickets/status/${filter}`;

        const result = await apiRequest(
          endpoint,
          {},
          authToken
        );

        const data = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [];

        setTickets(data);
      } catch (err) {
        console.error(
          "Support ticket error:",
          err
        );

        if (err.status === 401) {
          setError(
            "Your admin session has expired. Please log in again."
          );
        } else if (err.status === 403) {
          setError(
            "You do not have permission to manage support tickets."
          );
        } else {
          setError(
            err.message ||
            "Unable to load support tickets"
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filter, authToken]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchTickets();
  }, [filter, fetchTickets]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredTickets = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    if (!search) {
      return tickets;
    }

    return tickets.filter((ticket) => {
      const values = [
        ticket.id,
        ticket.subject,
        ticket.message,
        ticket.email,
        ticket.customerName,
        ticket.name,
        ticket.customer?.name,
        ticket.customer?.email,
        ticket.category,
        ticket.status,
        ticket.priority,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [tickets, searchTerm]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTickets.length / PAGE_SIZE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedTickets = useMemo(() => {
    const start =
      (safeCurrentPage - 1) * PAGE_SIZE;

    return filteredTickets.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredTickets, safeCurrentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(
        (ticket) => ticket.status === "OPEN"
      ).length,
      progress: tickets.filter(
        (ticket) =>
          ticket.status === "IN_PROGRESS"
      ).length,
      resolved: tickets.filter(
        (ticket) =>
          ticket.status === "RESOLVED"
      ).length,
      closed: tickets.filter(
        (ticket) => ticket.status === "CLOSED"
      ).length,
      urgent: tickets.filter(
        (ticket) =>
          ticket.priority === "URGENT"
      ).length,
    };
  }, [tickets]);

  // =========================================================
  // OPEN TICKET
  // =========================================================

  const openTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setReply("");

    try {
      setLoadingDetails(true);

      // Change this line:
      const result = await apiRequest(`/support/tickets/${ticket.id}`, {}, authToken);

      if (result?.data) {
        setSelectedTicket(result.data);
      }
    } catch (err) {
      console.warn("Unable to load full ticket details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // =========================================================
  // STATUS UPDATE
  // =========================================================

  const updateStatus = async (
    id,
    newStatus
  ) => {
    const ticket = tickets.find(
      (item) => item.id === id
    );

    if (!ticket) return;

    if (ticket.status === newStatus) {
      return;
    }

    const confirmed = window.confirm(
      `Change ticket #${id} status from "${formatStatus(
        ticket.status
      )}" to "${formatStatus(newStatus)}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdating(true);

      const result = await apiRequest(
        `/support/admin/tickets/${id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: newStatus,
          }),
        },
        authToken
      );

      const updatedAt =
        result?.data?.updatedAt ||
        new Date().toISOString();

      updateLocalTicket(id, {
        status: newStatus,
        updatedAt,
      });
    } catch (err) {
      alert(
        err.message ||
        "Failed to update ticket status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // PRIORITY UPDATE
  // =========================================================

  const updatePriority = async (
    id,
    newPriority
  ) => {
    const ticket = tickets.find(
      (item) => item.id === id
    );

    if (!ticket) return;

    if (ticket.priority === newPriority) {
      return;
    }

    const confirmed = window.confirm(
      `Change ticket #${id} priority from "${formatPriority(
        ticket.priority
      )}" to "${formatPriority(
        newPriority
      )}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdating(true);

      const result = await apiRequest(
        `/support/admin/tickets/${id}/priority`,
        {
          method: "PUT",
          body: JSON.stringify({
            priority: newPriority,
          }),
        },
        authToken
      );

      const updatedAt =
        result?.data?.updatedAt ||
        new Date().toISOString();

      updateLocalTicket(id, {
        priority: newPriority,
        updatedAt,
      });
    } catch (err) {
      alert(
        err.message ||
        "Failed to update ticket priority"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // LOCAL UPDATE
  // =========================================================

  const updateLocalTicket = (
    id,
    changes
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
            ...ticket,
            ...changes,
          }
          : ticket
      )
    );

    setSelectedTicket((prev) =>
      prev && prev.id === id
        ? {
          ...prev,
          ...changes,
        }
        : prev
    );
  };

  // =========================================================
  // ADMIN REPLY
  // =========================================================

  const sendReply = async () => {
    if (!selectedTicket) {
      return;
    }

    const message = reply.trim();

    if (!message) {
      alert("Please enter a reply.");
      return;
    }

    try {
      setSendingReply(true);

      const result = await apiRequest(
        `/support/admin/tickets/${selectedTicket.id}/reply`,
        {
          method: "POST",
          body: JSON.stringify({
            message,
          }),
        },
        authToken
      );

      const returnedTicket =
        result?.data?.ticket ||
        result?.data;

      if (
        returnedTicket &&
        returnedTicket.id
      ) {
        setSelectedTicket(
          returnedTicket
        );

        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.id ===
              returnedTicket.id
              ? {
                ...ticket,
                ...returnedTicket,
              }
              : ticket
          )
        );
      }

      setReply("");
      await fetchTickets(true);
    } catch (err) {
      alert(
        err.message ||
        "Failed to send admin reply"
      );
    } finally {
      setSendingReply(false);
    }
  };

  // =========================================================
  // DELETE TICKET
  // =========================================================

  const deleteTicket = async () => {
    if (!selectedTicket) {
      return;
    }

    try {
      setDeleting(true);

      await apiRequest(
        `/support/admin/tickets/${selectedTicket.id}`,
        {
          method: "DELETE",
        },
        authToken
      );

      const deletedId =
        selectedTicket.id;

      setTickets((prev) =>
        prev.filter(
          (ticket) =>
            ticket.id !== deletedId
        )
      );

      setSelectedTicket(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      alert(
        err.message ||
        "Failed to delete ticket"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const statusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "#3b82f6";
      case "IN_PROGRESS":
        return "#f59e0b";
      case "RESOLVED":
        return "#10b981";
      case "CLOSED":
        return "#64748b";
      default:
        return "#94a3b8";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "URGENT":
        return "#ef4444";
      case "HIGH":
        return "#f97316";
      case "NORMAL":
        return "#3b82f6";
      case "LOW":
        return "#64748b";
      default:
        return "#94a3b8";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }
    return parsed.toLocaleString();
  };

  const formatStatus = (status) => {
    if (!status) return "-";
    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatPriority = (priority) => {
    if (!priority) return "-";
    return (
      priority.charAt(0) +
      priority.slice(1).toLowerCase()
    );
  };

  const getCustomerName = (ticket) => {
    return (
      ticket?.customerName ||
      ticket?.name ||
      ticket?.customer?.name ||
      ticket?.user?.name ||
      ticket?.user?.fullName ||
      "Customer"
    );
  };

  const getCustomerEmail = (ticket) => {
    return (
      ticket?.email ||
      ticket?.customer?.email ||
      ticket?.user?.email ||
      "-"
    );
  };

  const getCustomerPhone = (ticket) => {
    return (
      ticket?.phone ||
      ticket?.customer?.phone ||
      ticket?.user?.phone ||
      "-"
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg, #090d16)",
        color: "var(--text-primary, #f8fafc)",
        padding: "24px",
      }}
    >
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div
            className="small fw-bold mb-1"
            style={{
              color: "#10b981",
              letterSpacing: "1px",
            }}
          >
            ADMIN / SUPPORT
          </div>

          <h2 className="fw-bold mb-1">
            Customer Support
          </h2>

          <p
            className="mb-0"
            style={{
              color: "var(--text-secondary, #94a3b8)",
            }}
          >
            Manage customer support tickets, priorities and conversations.
          </p>
        </div>

        <button
          onClick={() => fetchTickets(true)}
          disabled={refreshing}
          className="btn rounded-3 px-4"
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            fontWeight: 600,
          }}
        >
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <StatCard
          title="Total"
          value={stats.total}
          color="#8b5cf6"
          icon="🎫"
        />
        <StatCard
          title="Open"
          value={stats.open}
          color="#3b82f6"
          icon="📩"
        />
        <StatCard
          title="In Progress"
          value={stats.progress}
          color="#f59e0b"
          icon="⚙️"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          color="#10b981"
          icon="✓"
        />
        <StatCard
          title="Urgent"
          value={stats.urgent}
          color="#ef4444"
          icon="🚨"
        />
      </div>

      {/* SEARCH + FILTER */}
      <div
        className="p-3 rounded-4 mb-4"
        style={{
          background: "var(--card, #111827)",
          border: "1px solid var(--border, #1f2937)",
        }}
      >
        <div className="row g-3">
          <div className="col-lg-7">
            <div className="input-group">
              <span
                className="input-group-text"
                style={{
                  background: "var(--input-bg, #1f2937)",
                  color: "var(--text-secondary, #94a3b8)",
                  border: "1px solid var(--border, #374151)",
                }}
              >
                🔎
              </span>

              <input
                type="search"
                className="form-control"
                placeholder="Search ticket, customer, email, subject..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="col-lg-5">
            <div className="d-flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    setFilter(value);
                    setCurrentPage(1);
                  }}
                  className="btn rounded-pill px-3"
                  style={{
                    background:
                      filter === value
                        ? "#10b981"
                        : "var(--input-bg, #1f2937)",
                    color:
                      filter === value
                        ? "#fff"
                        : "var(--text-secondary, #94a3b8)",
                    border:
                      filter === value
                        ? "1px solid #10b981"
                        : "1px solid var(--border, #374151)",
                    fontWeight: 600,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          className="alert rounded-3 d-flex justify-content-between align-items-center"
          style={{
            background: "rgba(239,68,68,.1)",
            color: "#fca5a5",
            border: "1px solid rgba(239,68,68,.25)",
          }}
        >
          <span>{error}</span>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => fetchTickets()}
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <LoadingState />
      ) : filteredTickets.length === 0 ? (
        <EmptyState searching={Boolean(searchTerm.trim())} />
      ) : (
        <>
          {/* RESULT INFO */}
          <div
            className="d-flex justify-content-between align-items-center mb-2"
            style={{
              color: "var(--text-secondary, #94a3b8)",
              fontSize: "14px",
            }}
          >
            <span>
              Showing{" "}
              <strong>
                {(safeCurrentPage - 1) * PAGE_SIZE + 1}
              </strong>{" "}
              -{" "}
              <strong>
                {Math.min(
                  safeCurrentPage * PAGE_SIZE,
                  filteredTickets.length
                )}
              </strong>{" "}
              of <strong>{filteredTickets.length}</strong> tickets
            </span>
          </div>

          {/* TABLE */}
          <TicketTable
            tickets={paginatedTickets}
            onView={openTicket}
            getCustomerName={getCustomerName}
            getCustomerEmail={getCustomerEmail}
            statusColor={statusColor}
            priorityColor={priorityColor}
            formatDate={formatDate}
          />

          {/* PAGINATION */}
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* DETAIL MODAL */}
      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          loading={loadingDetails}
          updating={updating}
          reply={reply}
          setReply={setReply}
          sendingReply={sendingReply}
          deleting={deleting}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={updateStatus}
          onPriorityChange={updatePriority}
          onSendReply={sendReply}
          onDelete={deleteTicket}
          getCustomerName={getCustomerName}
          getCustomerEmail={getCustomerEmail}
          getCustomerPhone={getCustomerPhone}
          formatDate={formatDate}
          formatStatus={formatStatus}
          formatPriority={formatPriority}
          statusColor={statusColor}
          priorityColor={priorityColor}
          currentAdmin={user}
        />
      )}
    </div>
  );
};

export default AdminSupportTickets; 