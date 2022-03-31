import { useState } from "react";
import Head from "next/head";
import { useGarminLogData } from "../lib/data";
import GoogleMap from "../components/map";
import { differenceInHours, formatRelative } from "date-fns";

const UPDATE_PAGE_SIZE = 10;
export default function Home() {
  const { data, loading, error } = useGarminLogData();
  const [numUpdateShown, setNumUpdateShown] = useState(UPDATE_PAGE_SIZE);
  const [showWhatsThis, setShowWhatsThis] = useState(false);

  const lastDataPoint = data[data.length - 1];

  return (
    <div className="container">
      <Head>
        <title>Xinlu's PCT Page for friends & family</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main>
        <h2 className="title">Xinlu's PCT Page</h2>

        <p className="description">for friends & family</p>

        {error && (
          <div>
            Ooopsy, unable to load data. You can view the data on{" "}
            <a href="https://docs.google.com/spreadsheets/d/1gqqQljQm21SKEdzWAlrzSPcoeuJ0aurLgSxLwmbFXEs/edit#gid=0">
              Google Sheet
            </a>{" "}
            directly.
          </div>
        )}

        {loading && <div>Loading data...</div>}

        {!loading && !error && (
          <>
            <GoogleMap data={data} />

            <div className="update-container">
              {differenceInHours(new Date(), lastDataPoint.timestamp) > 48 && (
                <div className="update-notice">
                  <div>
                    Don't see a recent update here? <b>Don't worry!</b> Mostly
                    likely it's some trivial problem like my satelite messanger
                    ran out of battery, or there is a bug somewhere in my code
                    :)
                  </div>
                  <div>
                    The PCTA has some{" "}
                    <a href="https://www.pcta.org/discover-the-trail/backcountry-basics/safety-tips/emergency-beacon-search-rescue-trip-plan/">
                      good advice
                    </a>{" "}
                    on how to react when you are worry about someone on the
                    trail.
                  </div>
                </div>
              )}
              <b>Updates:</b>
              {data
                .slice(0, numUpdateShown)
                .reverse()
                .map((d, idx) => (
                  <div key={idx} className="update">
                    <span className="update-time">
                      {formatRelative(d.timestamp, new Date())}
                    </span>{" "}
                    <span>{d.message}</span>
                  </div>
                ))}

              {numUpdateShown < data.length && (
                <a
                  onClick={() =>
                    setNumUpdateShown(numUpdateShown + UPDATE_PAGE_SIZE)
                  }
                  className="secondary link"
                >
                  <u>show more...</u>
                </a>
              )}

              <div
                className="secondary link"
                style={{ marginTop: "30px" }}
                onClick={() => setShowWhatsThis(true)}
              >
                <i>What are these updates?</i> {!showWhatsThis && "[expand]"}
              </div>
              {showWhatsThis && (
                <>
                  <div>
                    I have a satelite messenger (Garmin InReach Mini 2) which I
                    use mainly for SOS purpose, but also occasionally drop some
                    location breadcrumb for logging purpose. I get a message on
                    my email which is then parsed by Google App Script in to a
                    Google Sheet; this page just shows the information from
                    sheet in a nice way.
                  </div>

                  <div>
                    How to reach me on the trail? Just send me a text! I'll
                    probably get it in a few days :)
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>

      <footer>
        <div>
          © Xinlu Huang {new Date().getFullYear()} [
          <a href="https://github.com/xinluh/pct-site">Github Repo</a>]
        </div>
        <div className="secondary">
          If you are one of my developer friends - pull requests to make this
          site look nicer are very, very welcome! I ran out of time to make this
          website nice before heading out to trail :)
        </div>

        <div className="secondary">
          It'd be very nice to show the{" "}
          <a href="https://www.pcta.org/discover-the-trail/maps/digital-mapping-and-gis-data/">
            PCT trail itself
          </a>{" "}
          on the map but I didn't have time to figure out how...
        </div>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 800px;
        }

        footer {
          text-align: left;
          width: 100%;
          max-width: 800px;
          height: 100px;
          border-top: 1px solid #eaeaea;
          margin: 10px;
        }

        footer div {
          margin: 10px;
        }

        a {
          color: inherit;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        .update-container {
          margin-top: 40px;
          text-align: left;
          width: 100%;
        }

        .update {
          margin-top: 0.5rem;
        }

        .update-time {
          font-size: 0.8rem;
          color: gray;
        }

        .update-notice {
          margin-top: 0.5rem;
          margin-bottom: 1rem;
          padding: 1rem;
          text-align: left;
          color: goldenrod;
          background-color: #fef8ea;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .update-notice div {
          margin-top: 0.5rem;
        }

        .secondary {
          font-size: 0.8rem;
          color: gray;
        }

        .link {
          cursor: pointer;
        }

        @media (max-width: 800px) {
          main {
            width: 100%;
          }

          footer {
            width: 100%;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
