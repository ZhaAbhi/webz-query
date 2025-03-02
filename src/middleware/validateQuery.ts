import { Request, Response, NextFunction } from "express";
import { query, validationResult, ValidationChain } from "express-validator";
import { RequestHandler } from "express";

export const validateQueryParams: RequestHandler[] = [
  query("query").trim().notEmpty().withMessage("Query is required").isLength({ min: 1, max: 100 }).withMessage("Query must be between 1 and 100 characters") as ValidationChain,
  query("format").optional().isIn(["json", "xml"]).withMessage("Format must be either 'json' or 'xml'") as ValidationChain,
  query("sort").optional().isIn(["relevancy", "date", "popularity"]).withMessage("Sort must be 'relevancy', 'date', or 'popularity'") as ValidationChain,
  query("filters.*")
    .optional()
    .custom((value: string) => {
      const pairs = value.split(",").map((pair) => pair.split(":"));
      return pairs.every(([key, val]) => key && val && key.length <= 50 && val.length <= 50);
    })
    .withMessage("Filters must be in 'key:value' format, max 50 chars each") as ValidationChain,

  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
