import { setupSidePanelBehavior } from './sidepanel-behavior';
import { initRouter } from './router';
import { authBridge } from './auth-bridge';

setupSidePanelBehavior();
authBridge.init();
initRouter();
