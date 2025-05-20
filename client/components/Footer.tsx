import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-300">
      <div
        className="max-w-7xl mx-auto px-6 py-14 grid gap-8
                        grid-cols-1 sm:grid-cols-2 md:grid-cols-5"
      >
        <div>
          <h2 className="text-4xl font-bold text-white select-none">
            trendies
          </h2>
        </div>

        <FooterCol
          title="CUSTOMER CARE"
          items={[
            "Support Center",
            "Authenticity",
            "Shipping Information",
            "Returns",
            "Consignment",
            "FAQ",
            "Sustainability",
            "My Privacy Choices",
            "Refer to Friend",
          ]}
        />
        <FooterCol
          title="COMPANY"
          items={[
            "About Us",
            "Team",
            "Careers",
            "Press",
            "Investor",
            "Partners",
            "Social Impact",
            "Business Sellers",
          ]}
        />
        <FooterCol
          title="LEGAL & POLICE"
          items={[
            "Terms of Service",
            "Terms of Use",
            "Term Consignor",
            "Privacy Policy",
            "Accessibility",
            "Cookie Policy",
          ]}
        />

        <div>
          <h3 className="uppercase font-semibold text-white mb-4">US FOLLOW</h3>
          <div className="flex gap-5 text-xl">
            <IconLink Icon={FaInstagram} link="#" label="Instagram" />
            <IconLink Icon={FaFacebookF} link="#" label="Facebook" />
            <IconLink Icon={FaXTwitter} link="#" label="X / Twitter" />
            <IconLink Icon={FaLinkedinIn} link="#" label="LinkedIn" />
            <IconLink Icon={FaYoutube} link="#" label="YouTube" />
            <IconLink Icon={FaTiktok} link="#" label="TikTok" />
          </div>
        </div>
      </div>

      <hr className="border-neutral-700" />
      <p className="text-center text-sm py-6 text-gray-400">
        © 2025 Trendies Morocco. All rights reserved.
      </p>
    </footer>
  );
}

interface FooterColProps {
  title: string;
  items: string[];
}

function FooterCol({ title, items }: FooterColProps) {
  return (
    <div>
      <h3 className="uppercase font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((txt) => (
          <li key={txt}>
            <a href="#" className="hover:text-white transition-colors">
              {txt}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IconLink({
  Icon,
  link,
  label,
}: {
  Icon: React.ComponentType;
  link: string;
  label: string;
}) {
  return (
    <a
      href={link}
      aria-label={label}
      className="hover:text-white transition-colors"
    >
      <Icon />
    </a>
  );
}
