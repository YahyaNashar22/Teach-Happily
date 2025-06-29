import "../css/CertificationTemplate.css";

import { useEffect, useState } from "react";

import ICertification from "../interfaces/ICertification";
import axios from "axios";
import Loading from "./Loading";

const CertificationTemplate = ({ id }: { id: string }) => {
  const backend = import.meta.env.VITE_BACKEND;

  const [loading, setLoading] = useState<boolean>(true);
  const [certification, setCertification] = useState<ICertification | null>(
    null
  );

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

  if (loading) return <Loading />;

  return (
    <div className="certificate">
      <div className="certificate-content">
        <h1>شهادة حضور</h1>
        <p>تشهد منصّة علّم بسعادة أن الأستاذة:</p>
        <h2>{certification?.student.fullName}</h2>
        <p>
          قد حضرت ورشة:
          <span>{certification?.course.title}</span>
        </p>
        <p>وذلك في التاريخ الموافق {certification?.created_at}</p>
        <p>سائلين الله لها التوفيق والنجاح في مسيرتها المهنية</p>
      </div>
    </div>
  );
};

export default CertificationTemplate;
