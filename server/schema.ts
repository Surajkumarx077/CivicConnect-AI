import { z } from "zod";

export const ReportSubmissionSchema = z.object({
  imageUrl: z.string().url("Must be a valid URL"),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});

export const ComplaintGenerationSchema = z.object({
  issueType: z.string(),
  location: z.string(),
  severity: z.string(),
  description: z.string(),
});

export const SeverityDeterminationSchema = z.object({
  issueType: z.string(),
  description: z.string(),
  location: z.string().optional(),
  traffic: z.string().optional(),
  healthRisk: z.string().optional(),
  accidentRisk: z.string().optional(),
  population: z.string().optional(),
  roadBlock: z.string().optional(),
});

export const ReportComparisonSchema = z.object({
  report1: z.object({
    imageDescription: z.string().optional(),
    location: z.string(),
    issueType: z.string(),
    time: z.string(),
    description: z.string(),
  }),
  report2: z.object({
    imageDescription: z.string().optional(),
    location: z.string(),
    issueType: z.string(),
    time: z.string(),
    description: z.string(),
  })
});

