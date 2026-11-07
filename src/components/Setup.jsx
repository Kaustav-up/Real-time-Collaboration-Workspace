export default function Setup() {
  return (
    <div className="empty setup">
      <h2>Firebase is not connected yet</h2>
      <p>
        Copy <code>.env.example</code> to <code>.env</code>, fill in the values from your Firebase
        project settings, then restart the dev server.
      </p>
    </div>
  );
}
