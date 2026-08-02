import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateString, validatePhoneNumber } from '@/utils/security';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await prisma.address.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        isDefault: 'desc'
      }
    });

    const mapped = data.map((addr: any) => ({
      id: addr.id,
      user_id: addr.userId,
      name: addr.name,
      type: addr.type,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
      is_default: addr.isDefault,
      created_at: addr.createdAt
    }));

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, type, street, city, state, postalCode, country, phone, isDefault } = body;

  // Input validation
  if (!name || !validateString(name, { min: 2, max: 100 })) {
    return NextResponse.json({ error: 'Invalid name (2-100 characters required)' }, { status: 400 });
  }

  if (!type || !validateString(type, { min: 2, max: 50 })) {
    return NextResponse.json({ error: 'Invalid address type' }, { status: 400 });
  }

  if (!street || !validateString(street, { min: 5, max: 200 })) {
    return NextResponse.json({ error: 'Invalid street address (5-200 characters required)' }, { status: 400 });
  }

  if (!city || !validateString(city, { min: 2, max: 100 })) {
    return NextResponse.json({ error: 'Invalid city (2-100 characters required)' }, { status: 400 });
  }

  if (!state || !validateString(state, { min: 2, max: 100 })) {
    return NextResponse.json({ error: 'Invalid state (2-100 characters required)' }, { status: 400 });
  }

  if (!postalCode || !validateString(postalCode, { min: 3, max: 20 })) {
    return NextResponse.json({ error: 'Invalid postal code (3-20 characters required)' }, { status: 400 });
  }

  if (!country || !validateString(country, { min: 2, max: 100 })) {
    return NextResponse.json({ error: 'Invalid country (2-100 characters required)' }, { status: 400 });
  }

  if (!phone || !validatePhoneNumber(phone)) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
  }

  if (typeof isDefault !== 'boolean' && isDefault !== undefined) {
    return NextResponse.json({ error: 'Invalid isDefault value' }, { status: 400 });
  }

  try {
    if (isDefault) {
      // Unset current default
      await prisma.address.updateMany({
        where: {
          userId: session.user.id
        },
        data: {
          isDefault: false
        }
      });
    }

    const data = await prisma.address.create({
      data: {
        userId: session.user.id,
        name,
        type,
        street,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: isDefault || false
      }
    });

    const mapped = {
      id: data.id,
      user_id: data.userId,
      name: data.name,
      type: data.type,
      street: data.street,
      city: data.city,
      state: data.state,
      postal_code: data.postalCode,
      country: data.country,
      phone: data.phone,
      is_default: data.isDefault,
      created_at: data.createdAt
    };

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, type, street, city, state, postalCode, country, phone, isDefault } = body;

    if (!id) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    // Input validation
    if (name !== undefined && !validateString(name, { min: 2, max: 100 })) {
      return NextResponse.json({ error: 'Invalid name (2-100 characters required)' }, { status: 400 });
    }

    if (type !== undefined && !validateString(type, { min: 2, max: 50 })) {
      return NextResponse.json({ error: 'Invalid address type' }, { status: 400 });
    }

    if (street !== undefined && !validateString(street, { min: 5, max: 200 })) {
      return NextResponse.json({ error: 'Invalid street address (5-200 characters required)' }, { status: 400 });
    }

    if (city !== undefined && !validateString(city, { min: 2, max: 100 })) {
      return NextResponse.json({ error: 'Invalid city (2-100 characters required)' }, { status: 400 });
    }

    if (state !== undefined && !validateString(state, { min: 2, max: 100 })) {
      return NextResponse.json({ error: 'Invalid state (2-100 characters required)' }, { status: 400 });
    }

    if (postalCode !== undefined && !validateString(postalCode, { min: 3, max: 20 })) {
      return NextResponse.json({ error: 'Invalid postal code (3-20 characters required)' }, { status: 400 });
    }

    if (country !== undefined && !validateString(country, { min: 2, max: 100 })) {
      return NextResponse.json({ error: 'Invalid country (2-100 characters required)' }, { status: 400 });
    }

    if (phone !== undefined && !validatePhoneNumber(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    if (typeof isDefault !== 'boolean' && isDefault !== undefined) {
      return NextResponse.json({ error: 'Invalid isDefault value' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    if (isDefault) {
      // Unset current default
      await prisma.address.updateMany({
        where: {
          userId: session.user.id
        },
        data: {
          isDefault: false
        }
      });
    }

    const data = await prisma.address.update({
      where: { id },
      data: {
        name,
        type,
        street,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: isDefault || false
      }
    });

    const mapped = {
      id: data.id,
      user_id: data.userId,
      name: data.name,
      type: data.type,
      street: data.street,
      city: data.city,
      state: data.state,
      postal_code: data.postalCode,
      country: data.country,
      phone: data.phone,
      is_default: data.isDefault,
      created_at: data.createdAt
    };

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
  }

  try {
    // Verify ownership
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
