var blessed = require('blessed');

var screen;

function start() {
    screen = blessed.screen({
      smartCSR: true,
    //   rows: 20,
    //   cols: 20
    });

    screen.title = 'my window title';

    screen.key('q', function(ch, key) {
        return process.exit(0);
    });
}

function showList(items, callback) {
    var list = blessed.list({
      parent: screen,
    //   cols: 20,
    //   rows: 20,
      width: '100%',
      height: '100%',
      top: 'center',
      left: 'center',
      align: 'center',
      fg: 'blue',
      border: {
        type: 'line'
      },
      selectedBg: 'green',

      // Allow mouse support
      // mouse: true,

      // Allow key support (arrow keys + enter)
      keys: true,

      // Use vi built-in keys
      vi: true
    });

    list.setItems(items);

    // list.prepend(new blessed.Text({
    //   left: 2,
    //   content: ' My list '
    // }));

    // Allow scrolling with the mousewheel (manually).
    // list.on('wheeldown', function() {
    //   list.down();
    // });
    //
    // list.on('wheelup', function() {
    //   list.up();
    // });

    list.on('select', function(event) {
        // console.log(Object.keys(event))
        // console.log(event.index)
        callback(event.index-1);
    })

    // Select the first item.
    list.select(0);
    screen.render();
}

function showAnswer() {

}

module.exports = {
    start: start,
    showList: showList,
    showAnswer: showAnswer,
    destroy: function() {
        screen.destroy();
    }
};
