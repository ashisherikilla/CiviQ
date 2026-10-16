import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatQuantity(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 3,
  });
}

function getUnitLabel(unit) {
  const unitLabels = {
    m3: "m3",
    m2: "m2",
    m: "m",
    kg: "kg",
    nos: "Nos",
    ls: "LS",
  };

  return unitLabels[unit] || unit;
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function generateBOQPDF({
  project,
  projectItems,
  categoryGroups,
}) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const generatedDate = formatDate();

  /*
   * =========================================================
   * DOCUMENT HEADER
   * =========================================================
   */

  // CiviQ branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(15, 23, 42);

  doc.text("CiviQ", 15, 17);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);

  doc.text(
    "Civil Engineering Estimation & BOQ",
    15,
    23
  );

  // Document title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(15, 23, 42);

  doc.text(
    "BILL OF QUANTITIES",
    pageWidth / 2,
    18,
    {
      align: "center",
    }
  );

  // Small document description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  doc.text(
    "Project Estimation Report",
    pageWidth / 2,
    24,
    {
      align: "center",
    }
  );

  /*
   * =========================================================
   * HEADER DIVIDER
   * =========================================================
   */

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);

  doc.line(
    15,
    29,
    pageWidth - 15,
    29
  );

  /*
   * =========================================================
   * PROJECT INFORMATION
   * =========================================================
   */

  const infoTop = 35;
  const infoHeight = 30;

  doc.setFillColor(248, 250, 252);

  doc.roundedRect(
    15,
    infoTop,
    pageWidth - 30,
    infoHeight,
    2,
    2,
    "F"
  );

  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  doc.text(
    "PROJECT INFORMATION",
    20,
    infoTop + 7
  );

  /*
   * First row
   */

  doc.setFontSize(7.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);

  doc.text(
    "PROJECT",
    20,
    infoTop + 15
  );

  doc.text(
    "CLIENT",
    105,
    infoTop + 15
  );

  doc.text(
    "LOCATION",
    190,
    infoTop + 15
  );

  /*
   * First row values
   */

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);

  doc.text(
    project.name || "-",
    20,
    infoTop + 20
  );

  doc.text(
    project.clientName || "-",
    105,
    infoTop + 20
  );

  doc.text(
    project.location || "-",
    190,
    infoTop + 20
  );

  /*
   * Second row
   */

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);

  doc.text(
    "STATUS",
    20,
    infoTop + 26
  );

  doc.text(
    "GENERATED ON",
    105,
    infoTop + 26
  );

  /*
   * Second row values
   */

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);

  doc.text(
    project.status || "Draft",
    20,
    infoTop + 31
  );

  doc.text(
    generatedDate,
    105,
    infoTop + 31
  );

  /*
   * =========================================================
   * TABLE DATA
   * =========================================================
   */

  const tableBody = [];

  let itemNumber = 0;

  categoryGroups.forEach((group, categoryIndex) => {
    /*
     * Category heading
     */

    tableBody.push([
      {
        content: `${String.fromCharCode(65 + categoryIndex)}. ${group.category}`,
        colSpan: 6,
        styles: {
          fontStyle: "bold",
          fillColor: [241, 245, 249],
          textColor: [30, 41, 59],
          halign: "left",
          cellPadding: 3,
        },
      },
    ]);

    /*
     * Items
     */

    group.items.forEach((item) => {
      itemNumber += 1;

      tableBody.push([
        itemNumber,
        item.description || "-",
        getUnitLabel(item.unit),
        formatQuantity(item.quantity),
        formatCurrency(item.rate),
        formatCurrency(item.amount),
      ]);
    });

    /*
     * Category subtotal
     */

    tableBody.push([
      {
        content: `${group.category} Subtotal`,
        colSpan: 5,
        styles: {
          halign: "right",
          fontStyle: "bold",
          textColor: [71, 85, 105],
          fillColor: [248, 250, 252],
        },
      },
      {
        content: formatCurrency(group.subtotal),
        styles: {
          halign: "right",
          fontStyle: "bold",
          textColor: [15, 23, 42],
          fillColor: [248, 250, 252],
        },
      },
    ]);
  });

  /*
   * =========================================================
   * GRAND TOTAL
   * =========================================================
   */

  const grandTotal = projectItems.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  /*
   * =========================================================
   * BOQ TABLE
   * =========================================================
   */

  autoTable(doc, {
    startY: 72,

    head: [
      [
        "No.",
        "Description",
        "Unit",
        "Quantity",
        "Rate",
        "Amount",
      ],
    ],

    body: tableBody,

    theme: "grid",

    /*
     * Repeat header on every page
     */
    showHead: "everyPage",

    /*
     * Allow table to naturally continue
     */
    pageBreak: "auto",

    margin: {
      top: 72,
      left: 15,
      right: 15,
      bottom: 18,
    },

    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,

      lineColor: [226, 232, 240],
      lineWidth: 0.2,

      textColor: [30, 41, 59],

      valign: "middle",
    },

    headStyles: {
      fillColor: [226, 232, 240],
      textColor: [30, 41, 59],

      fontStyle: "bold",

      halign: "center",
      valign: "middle",

      cellPadding: 3.5,
    },

    columnStyles: {
      0: {
        cellWidth: 15,
        halign: "center",
      },

      1: {
        cellWidth: 87,
        halign: "left",
      },

      2: {
        cellWidth: 25,
        halign: "center",
      },

      3: {
        cellWidth: 35,
        halign: "right",
      },

      4: {
        cellWidth: 40,
        halign: "right",
      },

      5: {
        cellWidth: 45,
        halign: "right",
      },
    },

    /*
     * Prevent unnecessary splitting of rows
     */
    rowPageBreak: "avoid",
  });

  /*
   * =========================================================
   * GRAND TOTAL BOX
   * =========================================================
   */

  let finalY = doc.lastAutoTable.finalY + 8;

  /*
   * If there isn't enough room on the current page,
   * create a new page.
   */

  if (finalY + 18 > pageHeight - 15) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFillColor(239, 246, 255);

  doc.roundedRect(
    15,
    finalY,
    pageWidth - 30,
    14,
    2,
    2,
    "F"
  );

  doc.setDrawColor(191, 219, 254);
  doc.setLineWidth(0.3);

  doc.roundedRect(
    15,
    finalY,
    pageWidth - 30,
    14,
    2,
    2,
    "S"
  );

  /*
   * Total label
   */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.setTextColor(30, 64, 175);

  doc.text(
    "TOTAL ESTIMATED COST",
    pageWidth - 75,
    finalY + 9,
    {
      align: "right",
    }
  );

  /*
   * Total amount
   */

  doc.setFontSize(12);

  doc.text(
    formatCurrency(grandTotal),
    pageWidth - 20,
    finalY + 9,
    {
      align: "right",
    }
  );

  /*
   * =========================================================
   * FOOTER
   * =========================================================
   */

  const pageCount =
    doc.internal.getNumberOfPages();

  for (
    let page = 1;
    page <= pageCount;
    page += 1
  ) {
    doc.setPage(page);

    const currentPageHeight =
      doc.internal.pageSize.getHeight();

    /*
     * Footer divider
     */

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);

    doc.line(
      15,
      currentPageHeight - 13,
      pageWidth - 15,
      currentPageHeight - 13
    );

    /*
     * Footer left
     */

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    doc.setTextColor(100, 116, 139);

    doc.text(
      "Generated using CiviQ",
      15,
      currentPageHeight - 7
    );

    /*
     * Footer center
     */

    doc.text(
      "Civil Engineering Estimation & BOQ",
      pageWidth / 2,
      currentPageHeight - 7,
      {
        align: "center",
      }
    );

    /*
     * Footer right
     */

    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - 15,
      currentPageHeight - 7,
      {
        align: "right",
      }
    );
  }

  /*
   * =========================================================
   * DOWNLOAD
   * =========================================================
   */

  const safeProjectName =
    (project.name || "Project")
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

  const fileName =
    `${safeProjectName || "Project"}_BOQ.pdf`;

  doc.save(fileName);
}