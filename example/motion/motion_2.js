// this is an example of a motion .. but simple for testing

export default function ()
{
    const t = [];
    const dx = (Math.PI * 4) / 100.0;

    function f(x)
    {
        return (2.0 * x) + 3;
    }

    for (let i = 0; i < 100; i++)
    {
        t.push([i * dx, f(i * dx)]);
    }

    return t;
}
