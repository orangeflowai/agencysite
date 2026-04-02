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
        const { _id, _type, sites, id: bodyId, ...updateData } = body;

        // Ensure id is properly formatted as a slug
        const updatePayload: Record<string, unknown> = { ...updateData };
        if (bodyId) {
            updatePayload.id = typeof bodyId === 'string' 
                ? { current: bodyId } 
                : bodyId;
        }

        // Update the add-on in Sanity
        const result = await client
            .patch(id)
            .set(updatePayload)
            .commit();

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
