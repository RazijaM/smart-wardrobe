function Footer() {
  return (
    <footer className="bg-dusty-100 border-t border-dusty-200 p-4 mt-auto">
      <div className="w-full text-center">
        <p className="text-dusty-600 text-sm">
          &copy; {new Date().getFullYear()} Smart Wardrobe - NTIP
        </p>
      </div>
    </footer>
  );
}

export default Footer;
