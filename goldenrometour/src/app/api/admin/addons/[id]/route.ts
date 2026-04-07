import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export const dynamic = 'force-dynamic';

// PUT /api/admin/addons/[id]
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const body = await req.json();
        const { _id, _type, sites, id: slugId, ...updateData } = body;

        // Formatted sites array for Sanity references
        const sitesRefs = sites?.map((siteId: string) => ({
            _type: 'reference',
            _ref: siteId
        })) || [];

        // Ensure id is properly formatted as a slug if present
        const formattedSlug = typeof slugId === 'string'
            ? { current: slugId }
            : slugId?.current
                ? slugId
                : undefined;

        // Update the add-on in Sanity
        const patch = client.patch(id).set(updateData);

        if (sitesRefs.length > 0) patch.set({ sites: sitesRefs });
        if (formattedSlug) patch.set({ id: formattedSlug });

        const result = await patch.commit();

        return NextResponse.json({ success: true, addOn: result });
    } catch (err: any) {
        console.error('Error updating add-on:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to update add-on' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/addons/[id]
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Delete the add-on from Sanity
        await client.delete(id);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Error deleting add-on:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to delete add-on' },
            { status: 500 }
        );
    }
}
