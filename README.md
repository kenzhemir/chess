# Practice project

This is a simple implementation of chess engine to practice Web Components.

# Architecture

When server (Google Firebase for now) sends the updates on the game, each client reads the chess moves in algebraic notation, re-runs the whole game move by move and then renders the final state of the board.  

# Future plans/ideas

- Complete the engine with win condition and special moves (castling, en passant)
- Optimize server-side interactions
- Try out MQTT protocol
- Try to make movement rules configurable
- Integrate with Communications platform (i.e. Telegram, Discord)
