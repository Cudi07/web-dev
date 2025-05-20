import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="mt-auto">
      {/* Questions Banner */}
      <div className="bg-gray-600 py-4 text-center">
        <h3 className="text-xl font-bold text-yellow-400">
          📢 Got questions or suggestions?
        </h3>
        <p className="text-white">
          Contact the Barangay Office or submit your concerns online.
        </p>
        <Link href="/contact" className="text-white hover:text-yellow-400">
          Contact Us ►
        </Link>
      </div>

      {/* Main Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Logo and Mission Section */}
            <div className="text-center md:text-left">
              <Image
                src="/SAN-AGUSTIN-removebg-preview.png"
                alt="Barangay Logo"
                width={150}
                height={150}
                className="mx-auto justify-center rounded-full bg-white p-2"
              />
              <p className="mt-1 p-10 text-center text-sm">
                God-centered, honest, united, and committed to delivering
                inclusive, transparent, and compassionate public service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/homepage"
                    className="text-yellow-400 hover:underline"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/announcements"
                    className="text-yellow-400 hover:underline"
                  >
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inquiry"
                    className="text-yellow-400 hover:underline"
                  >
                    Request
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-yellow-400 hover:underline"
                  >
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h1 className="mb-4 text-xl font-semibold">Contact Us</h1>
              <p className="mb-2">
                📍 Barangay Hall, San Agustin,
                <br />
                City of San Fernando,
                <br />
                Pampanga
              </p>
              <p className="mb-2">📞 (045) 123-4567</p>
              <p className="mb-2">✉️ brgy.sanagustin@gmail.com</p>
              <p className="mb-2">🕒 Monday to Friday, 8:00 AM – 5:00 PM</p>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">Our location</h3>

              <div className="mt-4">
                <Image
                  src="/MAP.png"
                  alt="Location Map"
                  width={300}
                  height={150}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-black py-4 text-center text-sm">
          <p>© 2025 Barangay San Agustin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
