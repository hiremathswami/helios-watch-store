const express = require("express");
const router = express.Router();

const blogs = [
  {
    title: "Stripping The Coat: Decoding Watch Case Treatments",
    category: "Feature",
    author: "Chetan Jhala",
    date: "November 3, 2025",
    image: "/images/blog1.jpg",
    excerpt: "Discover how different watch coatings like DLC, PVD, and ceramic affect both aesthetics and durability.",
    link: "#"
  },
  {
    title: "Norqain’s New Independence Wild One — The Skeleton Edition",
    category: "Review",
    author: "Ajinkya Nair",
    date: "November 1, 2025",
    image: "/images/blog2.jpg",
    excerpt: "A look at Norqain’s bold skeleton dial design with cutting-edge carbon fiber technology.",
    link: "#"
  },
  {
    title: "Panerai Refines the Luminor Formula With GMT Ceramica",
    category: "Spotlight",
    author: "Ajinkya Nair",
    date: "October 31, 2025",
    image: "/images/blog3.jpg",
    excerpt: "Panerai elevates its iconic Luminor line with a sleek matte ceramic case and in-house automatic movement.",
    link: "#"
  },
  {
    title: "The Omega Speedmaster ‘Dark And Grey Sides’ Get A 2025 Upgrade",
    category: "Review",
    author: "Ranwajyoti Jhala",
    date: "October 30, 2025",
    image: "/images/blog4.jpg",
    excerpt: "Omega’s fan-favorite Speedmaster Moonwatch gets new materials, improved performance, and modern appeal.",
    link: "#"
  },
  {
    title: "Old Timer, New Tricks: Favre Leuba’s Sea Sky Revival",
    category: "Review",
    author: "Ajinkya Nair",
    date: "October 29, 2025",
    image: "/images/blog5.jpg",
    excerpt: "A perfect blend of classic Swiss engineering and contemporary sports aesthetics.",
    link: "#"
  },
  {
    title: "Omega’s New Constellation Watches Light Up The Season",
    category: "Spotlight",
    author: "Sumita Bagchi",
    date: "October 28, 2025",
    image: "/images/blog6.jpg",
    excerpt: "The Constellation line receives a luxurious update with gold detailing and precision movement.",
    link: "#"
  },
];

router.get("/blogs", (req, res) => {
  res.render("blogs", { blogs });
});

module.exports = router;
