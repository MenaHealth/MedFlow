// app/api/patient/location/route.js
// used in the NewPatient.tsx form

export async function POST(req) {
    try {
        const { latitude, longitude } = await req.json();

        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();

        if (data && data.display_name) {
            return new Response(JSON.stringify({ location: data.display_name }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: 'No location found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch location data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}