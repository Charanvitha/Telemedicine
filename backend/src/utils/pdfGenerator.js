import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePrescriptionPdf = ({
  prescription,
  patient,
  doctor,
  appointment,
  fileName = `${prescription._id}.pdf`
}) =>
  new Promise((resolve, reject) => {
    const outputDir = path.resolve(__dirname, "../../prescriptions");
    fs.mkdirSync(outputDir, { recursive: true });

    const filePath = path.join(outputDir, fileName);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(24).text("Telemedicine Prescription", { align: "center" });
    doc.moveDown(1.2);

    doc.fontSize(11).fillColor("#374151").text(`Prescription ID: ${prescription._id}`);
    doc.text(`Issued On: ${new Date(prescription.createdAt).toLocaleString()}`);
    doc.moveDown();

    doc
      .fillColor("#111827")
      .fontSize(13)
      .text(`Doctor: ${doctor.name}`, { continued: true })
      .font("Helvetica")
      .text(`  (${doctor.specialization || "General"})`);
    doc.font("Helvetica").fontSize(13).text(`Patient: ${patient.name}`);
    doc.text(`Appointment: ${appointment.scheduledAt.toLocaleString()}`);
    doc.moveDown(1.2);

    doc.font("Helvetica-Bold").fontSize(16).text("Medicines");
    doc.moveDown(0.6);
    prescription.medicines.forEach((medicine, index) => {
      doc
        .roundedRect(50, doc.y, 495, 88, 8)
        .strokeColor("#D1D5DB")
        .lineWidth(1)
        .stroke();

      const top = doc.y + 12;
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(`Medicine ${index + 1}`, 64, top);
      doc.font("Helvetica").fontSize(12);
      doc.text(`Drug Name: ${medicine.name || "-"}`, 64, top + 22);
      doc.text(`Dose: ${medicine.dosage || "-"}`, 64, top + 40);
      doc.text(`Frequency: ${medicine.frequency || "-"}`, 300, top + 22);
      doc.text(`Duration: ${medicine.duration || "-"}`, 300, top + 40);
      doc.moveDown(5.2);
    });

    doc.font("Helvetica-Bold").fontSize(16).fillColor("#111827").text("Notes");
    doc.moveDown(0.4);
    doc.font("Helvetica").fontSize(12).text(prescription.notes || "No additional notes.");
    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
