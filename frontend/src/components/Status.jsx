export default function Status({ state, error }) {
  if (state === 'loading') {
    return (
      <div className="status">
        <i className="fa-solid fa-circle-notch fa-spin" /> กำลังโหลดข้อมูล...
      </div>
    );
  }
  if (state === 'error') {
    return (
      <div className="status error">
        <i className="fa-solid fa-triangle-exclamation" /> {error}
      </div>
    );
  }
  return null;
}
