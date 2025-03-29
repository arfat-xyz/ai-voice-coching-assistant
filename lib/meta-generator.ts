import { Metadata } from "next";

interface MetaParams {
  title?: string;
  description?: string;
  imageUrl?: string;
  domain?: string;
}

const generateMetadata = ({
  title = "",
  description = "An AI Base voice assistant",
  imageUrl = "/me.jpg",
  domain = "http://localhost:3000",
}: MetaParams): Metadata => {
  const customTitle = title + " | Arfatur Rahman";
  return {
    metadataBase: new URL(domain),
    title: customTitle,
    description,
    openGraph: {
      title: customTitle,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        {
          url: imageUrl,
        },
      ],
    },
  };
};

export default generateMetadata;
