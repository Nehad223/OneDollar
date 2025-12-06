
function Navbar() {
  return (
    <nav className="navbar container">
      <a className="navbar-brand d-flex align-items-center" href="/">
        <img
          src="/logo.avif"       
          alt="Logo"
          width="80"
          height="60"
          className="d-inline-block align-text-top me-2"
        />
        <span  >ONE DOLLAR</span>
      </a>
    </nav>
  );
}

export default Navbar;
