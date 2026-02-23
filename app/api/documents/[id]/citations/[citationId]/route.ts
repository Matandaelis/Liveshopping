export async function DELETE(
  req: Request,
  { params }: { params: { id: string; citationId: string } }
) {
  try {
    const { id, citationId } = await params;

    // TODO: Delete citation from database using Prisma
    // await prisma.citation.delete({
    //   where: { id: citationId },
    // });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: 'Failed to delete citation' },
      { status: 500 }
    );
  }
}
