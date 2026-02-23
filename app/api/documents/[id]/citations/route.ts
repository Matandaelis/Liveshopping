export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // TODO: Fetch citations from database using Prisma
    // const citations = await prisma.citation.findMany({
    //   where: { documentId: id },
    // });

    return Response.json([]);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch citations' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { title, authors, year, url, citationStyle } = await req.json();

    // TODO: Create citation in database using Prisma
    // const citation = await prisma.citation.create({
    //   data: {
    //     documentId: id,
    //     title,
    //     authors,
    //     publicationYear: year,
    //     url,
    //     citationStyle,
    //     formattedText: formatCitation(title, authors, year, citationStyle),
    //   },
    // });

    const citation = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      authors,
      year,
      citationStyle,
      formattedText: `${authors} (${year}). ${title}. Retrieved from ${url}`,
    };

    return Response.json(citation);
  } catch (error) {
    return Response.json(
      { error: 'Failed to create citation' },
      { status: 500 }
    );
  }
}
