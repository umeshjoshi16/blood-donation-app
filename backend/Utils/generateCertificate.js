import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateCertificate = (donor, hospital) => {
  return new Promise((resolve, reject) => {
    const fileName = `certificate-${donor._id}.pdf`;
    const dir = path.join(process.cwd(), "certificates");

    // Ensure certificates folder exists
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const filePath = path.join(dir, fileName);

    const doc = new PDFDocument({ layout: "landscape" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(30).text("Blood Donation Certificate", { align: "center" });
    doc.moveDown();
    doc.fontSize(20).text(`This certificate is awarded to`, { align: "center" });
    doc.moveDown();
    doc.fontSize(26).text(donor.userName, { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text(`For donating blood at ${hospital.hospitalName}`, { align: "center" });
    doc.moveDown();
    doc.text(`Location: ${hospital.city}, ${hospital.province}`, { align: "center" });
    doc.text(`Date: ${new Date().toDateString()}`, { align: "center" });

    doc.end();

    stream.on("finish", () => {
      // Return relative URL path for frontend
      resolve(`/certificates/${fileName}`);
    });

    stream.on("error", (err) => reject(err));
  });
};