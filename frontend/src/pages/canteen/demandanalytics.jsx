import { useEffect, useState } from "react";
import { canteenapi } from "../../api";

export default function DemandAnalytics() {
  const [data, setData] = useState({ demand: [] });

  useEffect(() => {
    canteenapi.dashboard().then(setData);
  }, []);

  const max = Math.max(
    ...data.demand.map((item) => Number(item.quantity)),
    1
  );

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <div className="pixel-label">canteen / analytics</div>
          <h1>demand map.</h1>
          <p>what students are actually ordering.</p>
        </div>
      </div>

      <div className="analytics-panel">
        {data.demand.map((item) => {
          const percentage = (Number(item.quantity) / max) * 100;

          return (
            <div className="analytics-row" key={item.item_name}>
              <div className="analytics-info">
                <strong>{item.item_name}</strong>
                <span>{item.quantity} ordered</span>
              </div>

              <div className="bar-track">
                <div className="bar" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
