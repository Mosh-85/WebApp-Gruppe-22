export async function bookingPost(data: any) {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Feil under booking');
    }

    return response.json();
}