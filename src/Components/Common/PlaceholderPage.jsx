import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
  const location = useLocation();
  // Extract the page name from the path (e.g. /jobs -> Jobs)
  const pageName = location.pathname.split('/').filter(Boolean).pop() || 'Page';
  const displayTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <div className="p-5 border rounded-3 shadow-sm bg-light">
        <h1 className="display-4 text-primary mb-3">🚧 {displayTitle}</h1>
        <p className="lead text-secondary">This page is currently under construction. Check back soon!</p>
        <button className="btn btn-outline-primary mt-3" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
