<template>
	<div class="container">
		<div class="title">
			<p>Todo list</p>
		</div>
		<div class="content">
			<div class="add">
				<b-button block variant="primary" @click="showModal">Добавить</b-button>
			</div>
			<div class="items-list">
				<ul class="items">
					<li class="item-parent" v-for="(item, id) in items">
						<div class="item">
							<p @click="checkIsDone(id, '')" :class="{done:item.isDone}">
								<input type="checkbox" v-model="item.isDone">
								<span>
									{{ item.text }}
								</span>
							</p>
							<a class="delete_link" @click="deleteItem(id, '')" v-if="item.isDone">Удалить</a>
						</div>
						
						<ul class="item-children" v-for="(child, childId) in item.children">
							<li>
								<div class="child">
									<p @click="checkIsDone(childId, id)" :class="{done:child.isDone}">
										<input type="checkbox" v-model="child.isDone">
										<span>
											{{ child.text }}
										</span>
									</p>
									<a class="delete_link" @click="deleteItem(childId, id)" v-if="child.isDone">Удалить</a>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>

		<b-modal ref="myModalRef" hide-footer title="Добавление нового элемента">
			<div class="d-block text-center">
			    <p v-if="error !== ''" class="error-text">{{ error }}</p>
			    <b-form-group
			      id="fieldset-2"
			      label="Родительский элемент"
			      label-for="todo"
			      label-cols-sm="4"
      			  label-cols-lg="3"
			    >
			      <b-form-select id="todo" v-model="selected" :options="todos()"></b-form-select>
			    </b-form-group>
				<b-form-group
			      id="fieldset-1"
			      label="Заголовок"
			      label-for="text"
			      label-cols-sm="4"
      			  label-cols-lg="3"
			    >
			      <b-form-input id="text" v-model="text" type="text" placeholder="Введите текст" />
			    </b-form-group>
			</div>
			<b-button class="mt-3" variant="primary" block @click="add">Добавить</b-button>
			<b-button class="mt-2" variant="danger" block @click="cancel">Отмена</b-button>
		</b-modal>

		<b-modal ref="delete_modal" hide-footer title="Подтверждение удаления">
			<div class="d-block text-center">
				<h3>Вы действительно хотите удалить элемент?</h3>
			</div>
			<b-button class="mt-3" variant="primary" block @click="confirmDelete()">Да</b-button>
			<b-button class="mt-2" variant="danger" block @click="deleteCancel()">Нет</b-button>
		</b-modal>
	</div>
</template>
<script>
import _ from 'lodash'
	export default {
		name: 'todo-list',
		data() {
			return {
				/**
				 * @name text
				 * @param {String} Заголовок todo-элемента
				 * @return {String} Result value
				*/
				text: '',
				/**
				 * @name selected
				 * @param {String} Выбранные элемент из select-списка
				 * @return {String} Result value
				*/
				selected: '',
				/**
				 * @name items
				 * @param {Array} Список элеменов
				 * @return {Array} Result value
				*/
				items: [
					{
						id: 1,
						isDone: false,
						isParent: true,
						text: '1',
						value: 'p_1',
						children: [
							{
								id: 3,
								isDone: false,
								isParent: false,
								parentId: 'p_1',
								text: '11',
								value: 'p_13'
							},
							{
								id: 4,
								isDone: false,
								isParent: false,
								parentId: 'p_1',
								text: '111',
								value: 'p_14'
							},
						]
					},
					{
						id: 2,
						isDone: false,
						isParent: true,
						text: '2',
						value: 'p_2',
						children: []
					},
					{
						id: 5,
						isDone: false,
						isParent: true,
						text: '3',
						value: 'p_3',
						children: []
					}
				],
				/**
				 * @name deleted_item
				 * @param {Object} Удаляемый объект
				 * @return {Object} Result value
				*/
				deleted_item: {},
				/**
				 * @name error
				 * @param {String} Ошибка
				 * @return {String} Result value
				*/
				error: ''
			}
		},
		created() {},
		methods: {
		    /*
			 * @name showModal()
			 * @description Открытие модального окна для добавления элемента
			*/
			showModal() {
		      this.$refs.myModalRef.show()
		    },
		    /*
			 * @name hideModal()
			 * @description Закрытие модального окна
			*/
		    hideModal() {
		      this.$refs.myModalRef.hide()
		    },
		    /*
			 * @name add()
			 * @description Добавление элемента
			 * @return Boolean
			*/
		    add() {
		      	this.error = ''
		      	let i = this.items.length + 1
		     	 if(this.text) {

			      	let item = {
			      		text: this.text,
			      		isDone: false,
			      	}

			      	if(this.selected) {
			      		let parent = _.find(this.items, item => item.value === this.selected)
			      		if(parent.children.length < 3) {
			      			item.value = `${parent.value}${i}`
				      		item.isParent = false
				      		item.parentId = parent.value
				      		item.id = i
				      		parent.children.push(item)
				      		this.text = ''
				            this.selected = ''
				      		this.hideModal()
				      		return true
			      		}
			      		if(parent.children.length === 3) {
			      			this.error = 'Превышен лимит вложенности. Выберите другой элемент'
			      			this.text = ''
				        	this.selected = ''
			      			return true
			      		}
			      	} else {
			      		item.isParent = true
			      		item.value = `p_${i}`
			      		item.id = i
			      		item.children = []
			      		this.items.push(item)
			      		this.text = ''
				        this.selected = ''
				        this.hideModal()
			      	}
			        
		    	}
		    },
		    /*
			 * @name cancel()
			 * @description Отмена добавления
			*/
		    cancel() {
		      this.text = ''
		      this.error = ''
		      this.selected = ''
		      this.hideModal()
		    },
		    /*
			 * @name checkIsDone()
			 * @description Проверка на выполненое задание и помещение его в конец списка
			 * @param <Number> id элемент
			 * @param <Number> parentId родителя
			*/
		    checkIsDone(id, parentId) {
		    	let checked = []

		    	// Дочерний элемент
		    	if(parentId !== '') {
		    		let parent = this.items[parentId]
		    		checked = parent.children[id]
		    		checked.isDone = !checked.isDone

		    		if(checked.isDone) {
		    			let done = _.cloneDeep(checked)
		    			this.items[parentId].children.splice(id, 1)
		    			this.items[parentId].children.push(done)
		    		}
		    	} else { /* Родительский элемент */
		    		checked = this.items[id]
		    		let children = checked.children
		    		checked.isDone = !checked.isDone;

		    		for(let i = 0; i < children.length; i++) {
		    			if(!children[i].isDone) {
		    				children[i].isDone = !children[i].isDone
		    			}
		    		}

		    		if(checked.isDone) {
		    			let done = _.cloneDeep(checked)
			    		this.items.splice(id, 1)
			    		this.items.push(done)
		    		}
		    	}
		    },
		    /*
			 * @name deleteItem()
			 * @description Открытие диалога удаления элемента
			 * @param <Number> id элемент
			 * @param <Number> parentId родителя
			*/
		    deleteItem(id, parentId) {
		    	this.deleted_item = {id, parentId}
		    	this.$refs.delete_modal.show()
		    },
		    /*
			 * @name confirmDelete()
			 * @description Подтверждение удаления
			*/
		    confirmDelete() {
				if(this.deleted_item.parentId !== '') {
		    		this.items[this.deleted_item.parentId].children.splice(this.deleted_item.id, 1)
		    	} else {
		    		this.items.splice(this.deleted_item.id, 1)
		    	}
		    	this.$refs.delete_modal.hide()
		    },
		    /*
			 * @name todos()
			 * @description Возвращает список элементов для select-а
			 * @return Array || []
			*/
		    todos() {
				return _.filter(this.items, item => item.isParent === true)
			}
		},
	};
</script>