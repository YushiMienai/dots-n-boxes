import type {IGameState} from '@types'
import {COLOR_PALETTE} from '@config'

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height)
}

export const drawLines = (ctx: CanvasRenderingContext2D, gameState: IGameState): void => {
  const allLines = [...gameState.horizontalLines, ...gameState.verticalLines]

  allLines.forEach(line => {
    ctx.strokeStyle = line.isSelected ? COLOR_PALETTE.LINES.SELECTED : COLOR_PALETTE.LINES.DEFAULT
    ctx.lineWidth = line.isSelected ? 2.5 : 2
    ctx.beginPath()
    ctx.moveTo(line.start.x, line.start.y)
    ctx.lineTo(line.end.x, line.end.y)
    ctx.stroke()
  })
}

export const drawCells = (ctx: CanvasRenderingContext2D, gameState: IGameState): void => {
  gameState.cells.forEach(cell => {
    if (cell.owner !== null) {
      const player = gameState.players.find(p => p.id === cell.owner)
      if (player) {
        ctx.fillStyle = player.color
        ctx.globalAlpha = 0.8
        ctx.fillRect(
          cell.left.clickableEnd.x + 1,
          cell.top.clickableEnd.y + 1,
          cell.right.clickableStart.x - cell.left.clickableEnd.x - 2,
          cell.bottom.clickableStart.y - cell.top.clickableEnd.y - 2
        )
        ctx.globalAlpha = 1.0
      }
    }
  })
}

export const renderGame = (ctx: CanvasRenderingContext2D, gameState: IGameState): void => {
  const {width, height} = ctx.canvas
  clearCanvas(ctx, width, height)
  drawLines(ctx, gameState)
  drawCells(ctx, gameState)
}
