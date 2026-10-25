import { NextResponse } from "next/server";
import { handle, parseJson } from "@/server/http";
import { requireAdmin, requireStaff } from "@/server/auth/staff";
import { computerCreateSchema, createComputer, listComputersWithState } from "@/server/services/computers";
import { writeAuditLog } from "@/server/services/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/computers — все ПК с операционным состоянием (admin, manager)
export const GET = handle(async (req) => {
  await requireStaff(req);
  const computers = await listComputersWithState();
  return NextResponse.json({ computers, total: computers.length });
});

// POST /api/admin/computers — добавить компьютер (admin)
export const POST = handle(async (req) => {
  const admin = await requireAdmin(req);
  const input = await parseJson(req, computerCreateSchema);
  const computer = await createComputer(input);
  await writeAuditLog({ userId: admin.id, action: "CREATE_COMPUTER", entityType: "Computer", entityId: computer.id, newData: input });
  return NextResponse.json({ success: true, computer: { id: computer.id, number: computer.number } }, { status: 201 });
});
