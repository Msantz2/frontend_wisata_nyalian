/**
 * Health Check Endpoint
 * Add to app/api/health/route.ts
 * 
 * Provides comprehensive health status and metrics
 * Useful for monitoring and load balancers
 */

import { NextResponse } from "next/server";

// ========== HEALTH CHECK STATE ==========
const startTime = Date.now();
let requestCount = 0;
let errorCount = 0;

export async function GET() {
  try {
    requestCount++;
    const memory = process.memoryUsage();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    
    // Determine health status
    let status: "healthy" | "degraded" | "unhealthy" = "healthy";
    const issues: string[] = [];

    // Check memory
    const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memory.heapTotal / 1024 / 1024);
    
    if (heapUsedMB > 400) {
      status = "unhealthy";
      issues.push(`High memory usage: ${heapUsedMB}MB`);
    } else if (heapUsedMB > 300) {
      status = "degraded";
      issues.push(`Elevated memory usage: ${heapUsedMB}MB`);
    }

    // Check error rate
    const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;
    if (errorRate > 5) {
      status = "unhealthy";
      issues.push(`High error rate: ${errorRate.toFixed(2)}%`);
    } else if (errorRate > 1) {
      status = "degraded";
      issues.push(`Elevated error rate: ${errorRate.toFixed(2)}%`);
    }

    // Check uptime (alert if just started)
    if (uptime < 30) {
      status = "degraded";
      issues.push("Recently started");
    }

    return NextResponse.json(
      {
        status,
        timestamp: new Date().toISOString(),
        uptime,
        process: {
          pid: process.pid,
          version: process.version,
          platform: process.platform,
          arch: process.arch,
        },
        memory: {
          heapUsed: heapUsedMB,
          heapTotal: heapTotalMB,
          external: Math.round(memory.external / 1024 / 1024),
          rss: Math.round(memory.rss / 1024 / 1024),
        },
        performance: {
          requests: requestCount,
          errors: errorCount,
          errorRate: errorRate.toFixed(2) + "%",
        },
        issues,
      },
      {
        status: status === "healthy" ? 200 : status === "degraded" ? 202 : 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    errorCount++;
    console.error("[HEALTH] Check failed:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
