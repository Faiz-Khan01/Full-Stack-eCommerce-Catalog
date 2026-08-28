// const CategoryFilter = ({
//   categories = [],
//   selectedCategory,
//   onSelect,
// }) => {
//   return (
//     <div
//       className="position-relative"
//       style={{
//         width: "100%",
//       }}
//     >
//       {/* Premium Select Wrapper */}
//       <div
//         className="position-relative"
//         style={{
//           background:
//             "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
//           borderRadius: "14px",
//           boxShadow:
//             "0 8px 24px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(15, 23, 42, 0.04)",
//         }}
//       >
//         {/* Category Icon */}
//         <div
//           className="position-absolute d-flex align-items-center justify-content-center"
//           style={{
//             left: "14px",
//             top: "50%",
//             transform: "translateY(-50%)",
//             width: "34px",
//             height: "34px",
//             borderRadius: "10px",
//             background:
//               "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
//             color: "#2563eb",
//             fontSize: "16px",
//             pointerEvents: "none",
//             zIndex: 2,
//           }}
//         >
//           ☰
//         </div>

//         <select
//           className="form-select"
//           value={selectedCategory || ""}
//           onChange={(e) => onSelect(e.target.value)}
//           aria-label="Select category"
//           style={{
//             minHeight: "54px",
//             paddingLeft: "60px",
//             paddingRight: "45px",
//             borderRadius: "14px",
//             border: "1px solid #e2e8f0",
//             backgroundColor: "transparent",
//             color: "#1e293b",
//             fontSize: "15px",
//             fontWeight: "600",
//             boxShadow: "none",
//             cursor: "pointer",
//             transition:
//               "all 0.25s ease",
//           }}
//           onFocus={(e) => {
//             e.currentTarget.style.borderColor = "#6366f1";
//             e.currentTarget.style.boxShadow =
//               "0 0 0 4px rgba(99, 102, 241, 0.10)";
//           }}
//           onBlur={(e) => {
//             e.currentTarget.style.borderColor = "#e2e8f0";
//             e.currentTarget.style.boxShadow = "none";
//           }}
//         >
//           <option value="">All Categories</option>

//           {categories.map((category) => (
//             <option key={category.id} value={category.id}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default CategoryFilter;






const CategoryFilter = ({
  categories = [],
  selectedCategory,
  onSelect,
}) => {
  return (
    <div
      className="position-relative"
      style={{
        width: "100%",
      }}
    >
      {/* Premium Select Wrapper */}
      <div
        className="position-relative"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          borderRadius: "14px",
          boxShadow:
            "0 8px 24px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* Category Icon */}
        <div
          className="position-absolute d-flex align-items-center justify-content-center"
          style={{
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)",
            color: "#2563eb",
            fontSize: "16px",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          ☰
        </div>

        <select
          className="form-select"
          value={selectedCategory || ""}
          onChange={(e) => onSelect(e.target.value)}
          aria-label="Select category"
          style={{
            minHeight: "54px",
            paddingLeft: "60px",
            paddingRight: "45px",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            backgroundColor: "transparent",
            color: "#1e293b",
            fontSize: "15px",
            fontWeight: "600",
            boxShadow: "none",
            cursor: "pointer",
            transition:
              "all 0.25s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.boxShadow =
              "0 0 0 4px rgba(99, 102, 241, 0.10)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategoryFilter;