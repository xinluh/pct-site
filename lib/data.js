import { useState, useEffect } from "react";
import promiseRetry from "promise-retry";

const API_KEY = "AIzaSyApgm2nFzwLrOyISptqXF9RbiHyq1Josbk"; // this is restricted to localhost, github.io/xinluh and xinlu.dev domains
const SHEET_ID =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY ??
  "1gqqQljQm21SKEdzWAlrzSPcoeuJ0aurLgSxLwmbFXEs";

function _fetchData() {
  const TAB = "garminLog";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}?key=${API_KEY}`;
  const fetchedData = fetch(url).then((response) => response.json());

  return fetchedData.then((data) => {
    if (!data.values) {
      throw new Error("Failed to load google sheet");
    }
    const header = data.values[0];
    // discard first 2 rows; also drop rows without first column
    const rows = data.values.slice(1).filter((d) => d[0]);

    return rows.map((row) => {
      const values = Object.fromEntries(
        row.map((value, colIdx) => [header[colIdx], value])
      );

      return {
        ...values,
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng),
        message: values.Message,
        timestamp: Date.parse(values["Message Time"]),
      };
    });
  });
}

export function useGarminLogData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    promiseRetry(
      (retry, number) => {
        console.log("attempt number", number);

        return _fetchData().catch((err) => {
          if (err.message === "Failed to load google sheet") {
            retry(err);
          } else {
            throw err;
          }
        });
      },
      { retries: 3 }
    ).then(
      (ret) => {
        setData(ret);
        setLoading(false);
      },
      (err) => {
        setError(err);
        console.log(err);
        setLoading(false);
      }
    );
  }, []);

  return { data, loading, error };
}
