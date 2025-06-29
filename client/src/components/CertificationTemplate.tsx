import "../css/CertificationTemplate.css";

import { useEffect, useState } from "react";

import ICertification from "../interfaces/ICertification";

const CertificationTemplate = () => {
  const [certification, setCertification] = useState<ICertification | null>(
    null
  );

  useEffect(() => {
    setCertification({
      _id: "12",
      student: { fullName: "asd", _id: "12" },
      course: { _id: "2", title: " 23" },
      created_at: "123",
    });
  }, []);

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
