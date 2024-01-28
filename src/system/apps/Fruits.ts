import HTML from '../../HTML';
import { Process } from '../../types';

import icon from '../../assets/icons/fruits.png';
import cherriesIcon from '../../assets/icons/fruits/cherries.png';
import lemonIcon from '../../assets/icons/fruits/lemon.png';
import tangerineIcon from '../../assets/icons/fruits/tangerine.png';

const SlotMachine: Process = {
  config: {
    name: 'Fruits',
    type: 'process',
    icon: icon,
    targetVer: '1.0.0-indev.0',
  },
  run: async (process) => {
    const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
      return wm.createWindow({
        title: 'Fruits',
        icon: icon,
        width: 400,
        height: 500,
        canResize: false,
      }, process);
    });

    const setupWindowStyles = () => {
      win.content.style.padding = '20px';
      win.content.style.textAlign = 'center';
      win.content.style.display = 'flex';
      win.content.style.flexDirection = 'column';
      win.content.style.justifyContent = 'center';
      win.content.style.alignItems = 'center';
      win.content.style.background = '#181825';
    };

    const createReelContainer = () => {
      return new HTML('div').appendTo(win.content).style({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
        height: '150px',
        overflow: 'hidden',
      });
    };

    const createOverlay = (parentElement: HTML) => {
      new HTML('div').appendTo(parentElement).style({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: '#000',
        opacity: '0.5',
      });
    };

    const icons = [cherriesIcon, lemonIcon, tangerineIcon];

    const getRandomIcon = () => icons[Math.floor(Math.random() * icons.length)];

    const slotIcons = [getRandomIcon(), getRandomIcon(), getRandomIcon()];

    const updateReel = (reelContainer: HTML) => {
      reelContainer.clear();
      slotIcons.forEach((icon) => {
        new HTML('img').attr({
          src: icon,
          width: '100',
          height: '100',
        }).appendTo(reelContainer);
      });
    };

    let isSpinning = false;

    const spinSlotMachine = () => {
      if (isSpinning) return;

      isSpinning = true;

      const spinDuration = 3000;
      const frameDuration = 100;
      const winColor = '#FFD700';

      let frameCount = 0;
      const totalFrames = spinDuration / frameDuration;

      const spinInterval = setInterval(() => {
        if (frameCount < totalFrames - 1) {
          slotIcons.unshift(getRandomIcon());
          slotIcons.pop();
        }

        updateReel(reelContainer);

        frameCount++;

        if (frameCount === totalFrames) {
          clearInterval(spinInterval);

          if (slotIcons[0] === slotIcons[1] && slotIcons[1] === slotIcons[2]) {
            const button = win.content.querySelector('button');
            button.style.transition = 'background-color 0.5s ease-out';
            button.style.backgroundColor = winColor;

            setTimeout(() => {
              button.style.transition = 'background-color 0.5s ease';
              button.style.backgroundColor = '#3498db';
            }, 3000);
          }

          isSpinning = false;
        }
      }, frameDuration);
    };

    setupWindowStyles();

    const reelContainer = createReelContainer();
    createOverlay(reelContainer);

    updateReel(reelContainer);

    new HTML('button')
      .text('Spin')
      .on('click', spinSlotMachine)
      .appendTo(win.content)
      .attr({
        style: 'font-size: 18px; padding: 10px 20px; background: #3498db; color: #fff; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;',
      });
  },
};

export default SlotMachine;
