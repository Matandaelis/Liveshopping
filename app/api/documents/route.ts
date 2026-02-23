export async function GET(req: Request) {
  try {
    // TODO: Fetch documents from database using Prisma
    // const documents = await prisma.document.findMany({
    //   where: { userId: session.user.id },
    //   orderBy: { lastModified: 'desc' },
    // });

    return Response.json([]);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, content = '', templateId } = await req.json();

    // TODO: Create document in database using Prisma
    // const document = await prisma.document.create({
    //   data: {
    //     userId: session.user.id,
    //     title,
    //     content,
    //     templateId,
    //     status: 'DRAFT',
    //   },
    // });

    const document = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      status: 'DRAFT',
      wordCount: 0,
      lastModified: new Date().toISOString(),
    };

    return Response.json(document);
  } catch (error) {
    return Response.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
