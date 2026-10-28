// import { Request, Response } from "express";
// import httpStatus from "http-status-codes";

// const notFound = (req: Request, res: Response) => {
//   res.status(httpStatus.NOT_FOUND).json({
//     success: false,
//     message: "Route Not Found",
//   });
// };

// export default notFound;

import { Request, Response } from "express";
import httpStatus from "http-status-codes";

const notFound = (req: Request, res: Response) => {
  console.log("=== 404 NOT FOUND ===");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Path:", req.path);
  console.log("Query:", req.query);
  console.log("=====================");

  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Route Not Found",
  });
};

export default notFound;
