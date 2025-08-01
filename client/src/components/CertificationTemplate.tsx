import "../css/CertificationTemplate.css";

import { useEffect, useState, useRef } from "react";

import ICertification from "../interfaces/ICertification";
import axios from "axios";
import Loading from "./Loading";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificationTemplate = ({
  id,
  thumbnail = false,
}: {
  id: string;
  thumbnail?: boolean;
}) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [loading, setLoading] = useState<boolean>(true);
  const [certification, setCertification] = useState<ICertification | null>(
    null
  );
  const [hideButton, setHideButton] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backend}/certification/${id}`);
        setCertification(res.data.payload);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [backend, id]);

  // Helper to format date in Arabic
  const formatArabicDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    setHideButton(true);
    await new Promise((resolve) => setTimeout(resolve, 50)); // allow re-render
    try {
      const certElement = certRef.current;
      if (!certElement) return;
      const canvas = await html2canvas(certElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`certificate-${id}.pdf`);
    } finally {
      setHideButton(false);
    }
  };

  if (loading) return <Loading />;

  if (!certification || !certification.student || !certification.course) {
    return (
      <div
        className="certificate-error"
        style={{ textAlign: "center", color: "red", padding: "2rem" }}
      >
        تعذر تحميل بيانات الشهادة. يرجى المحاولة لاحقًا.
      </div>
    );
  }

  return (
    <div
      className={`certificate${thumbnail ? " certificate-thumbnail" : ""}`}
      id={`certificate-${id}`}
      ref={certRef}
      style={
        thumbnail
          ? {
              width: 220,
              minWidth: 180,
              maxWidth: 240,
              height: 140,
              minHeight: 120,
              maxHeight: 180,
              padding: 8,
              fontSize: 12,
              boxShadow: "0 1px 4px #ccc",
            }
          : {}
      }
    >
      <p id="teacher">{certification.course.teacher.fullname}</p>
      <div
        className="certificate-content"
        style={thumbnail ? { padding: 4, fontSize: 12 } : {}}
      >
        <h1 style={thumbnail ? { fontSize: 16, margin: 0 } : {}}>شهادة حضور</h1>
        <p
          style={
            thumbnail
              ? { fontSize: 10, margin: 0, textAlign: "center" }
              : { textAlign: "center" }
          }
        >
          تشهد منصّة علّم بسعادة أن الأستاذ/ة:
        </p>
        <h2 style={thumbnail ? { fontSize: 13, margin: 0 } : {}}>
          {certification.student.fullName}
        </h2>
        <p style={thumbnail ? { fontSize: 10, margin: 0 } : {}}>
          قد حضر/ـت ورشة:
          <span style={thumbnail ? { fontSize: 11 } : {}}>
            {certification.course.title}
          </span>
        </p>
        <p style={thumbnail ? { fontSize: 10, margin: 0 } : {}}>
          وذلك في التاريخ الموافق {formatArabicDate(certification.created_at)}
        </p>
        {!thumbnail && (
          <p>سائلين الله لهـ/ـا التوفيق والنجاح في مسيرتهـ /ـا المهنية </p>
        )}
      </div>
      {/* Download PDF Button */}
      {!hideButton && !thumbnail && (
        <button
          className="get-certificate-btn"
          style={{ marginTop: 24 }}
          onClick={handleDownloadPDF}
        >
          تحميل الشهادة PDF
        </button>
      )}
    </div>
  );
};

export default CertificationTemplate;
