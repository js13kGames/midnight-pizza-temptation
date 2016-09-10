
import color                    from 'ui/color'
import {getCarrierPosition}     from 'ui/projection'


const marge = 0

module.exports = ( width, height, carriers ) => {


    //// instanciate canvas

    const canvas  = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    const update = () => {
        ctx.clearRect(0,0,width,height)

        // draw gps path
        carriers
            .filter( carrier => carrier.control )
            .forEach( carrier => {

                const path = [ getCarrierPosition( carrier, marge, 0 ), carrier.position.arc.node_b, ...carrier.decision.path ]

                ctx.save()
                ctx.lineCap     = 'round'
                ctx.lineJoin    = 'round'
                ctx.strokeStyle = color( carrier )
                ctx.globalAlpha = 0.2
                ctx.lineWidth   = 7
                // ctx.globalCompositeOperation = 'lighten'
                ctx.beginPath()
                ctx.moveTo( path[0].x, path[0].y )
                path.forEach( p => ctx.lineTo( p.x, p.y ) )

                ctx.stroke()
                ctx.globalAlpha = 0.5
                ctx.lineWidth   = 2
                ctx.beginPath()
                ctx.moveTo( path[0].x, path[0].y )
                path.forEach( p => ctx.lineTo( p.x, p.y ) )
                ctx.stroke()
                ctx.restore()

            })

        // draw carrier
        carriers.forEach( carrier => {

            const p = getCarrierPosition( carrier, marge, 2 )

            ctx.beginPath()
            ctx.fillStyle = color( carrier )
            ctx.arc( p.x, p.y, 2, 0, Math.PI*2 )
            ctx.fill()

        })


        carriers
            .filter( carrier => carrier.control )
            .forEach( carrier => {

                const last = carrier.decision.path.length==0
                    ? carrier.position.arc.node_b
                    : carrier.decision.path[ carrier.decision.path.length-1 ]


                ctx.save()

                ctx.beginPath()
                ctx.strokeStyle='#fff'
                ctx.lineWidth   = 3
                ctx.moveTo( last.x, last.y )
                ctx.lineTo( last.x, last.y-15 )
                ctx.stroke()

                ctx.beginPath()
                ctx.fillStyle   = color( carrier )
                ctx.arc( last.x, last.y-15, 6, 0, Math.PI*2 )
                ctx.stroke()
                ctx.fill()

                ctx.restore()

            })


    }

    return {
        canvas,
        update
    }
}