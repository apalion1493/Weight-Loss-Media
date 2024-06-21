import './style.css'

import Alpine from 'alpinejs'
import './scripts/about'

window.Alpine = Alpine

Alpine.data('home', () => ({
	open: false,
	message: 'lorem',

	toggle() {
		this.open = !this.open
	},
}))

Alpine.start()
