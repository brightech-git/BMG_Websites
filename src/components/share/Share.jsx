import { FaWhatsapp, FaTwitter } from "react-icons/fa";

export const ShareButtons = ({ tagKey }) => {

    // Hardcode the OG page URL (this is the only correct thing WhatsApp needs)
    const ogShareUrl = `https://app.bmgjewellers.com/product/whatsapp-link?sno=${tagKey}`;

    // WhatsApp share link with preview support
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(ogShareUrl)}`;

    return (
        <div className="flex gap-4">

            {/* WhatsApp */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col text-xs items-center gap-1 text-green-400 hover:text-green-600"
            >
                <FaWhatsapp className="w-5 h-5" />
                WhatsApp
            </a>

            {/* Twitter */}
            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    "Check this product! " + ogShareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col text-xs items-center gap-1 text-black hover:text-gray-600"
            >
                <FaTwitter className="w-5 h-5" />
                Twitter
            </a>

        </div>
    );
};
