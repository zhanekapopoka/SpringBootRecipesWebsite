const LIST_IDS = {
            PRODUCTS: "productList",
            RECIPES: "recipeList"
        };

        function getAnything(url) {
            return fetch(url, {
                method: "GET"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    return response.json();
                });
        }

        function drawList(listId, data, renderFunction) {
            const list = document.getElementById(listId);
            list.innerHTML = "";
            data.forEach(item => {
                const listItem = document.createElement("li");
                listItem.textContent = renderFunction(item) + " ";
                addButton(listItem, item, listId);
                list.appendChild(listItem);
            });
        }

        function getProducts() {
            getAnything(
                "http://localhost:8080/api/products"
            ).then(data => {
                drawList(LIST_IDS.PRODUCTS, data,
                    product => `${product.name} - ${product.translate} - ${product.alterName}`);
            });
        }

        function getRecipes() {
            getAnything(
                "http://localhost:8080/api/recipes"
            ).then(data => {
                drawList(LIST_IDS.RECIPES, data,
                    recipe => `${recipe.name} - ${recipe.translate_of_recipe} - ${recipe.alter_name_of_recipe} - ${recipe.recipe}`);
            });
        }

        function createButton(text, onClick) {
            const button = document.createElement("button");
            button.textContent = text;
            button.onclick = onClick;
            return button;
        }

        function addButton(listItem, item, listId) {
            const updateButton = createButton("Изменить", function () {
                updateSelectedItem(item, listId);
            });

            const deleteButton = createButton("Удалить", function () {
                deleteSelectedItem(item, listId);
            });

            listItem.appendChild(updateButton);
            listItem.appendChild(deleteButton);
        }

        function deleteSelectedItem(item, listId) {
            if (listId === LIST_IDS.PRODUCTS) {
                deleteItem("http://localhost:8080/api/product", item.id)
                    .then(() => getProducts())
                    .catch(error => {
                        console.error('Ошибка при удалении продукта:', error);
                        document.getElementById("serverMessage").textContent = "Сервер недоступен. Пожалуйста, попробуйте позже.";
                    });
            }
            else if (listId === LIST_IDS.RECIPES) {
                deleteItem("http://localhost:8080/api/recipes", item.idOfRecipe)
                    .then(() => getRecipes())
                    .catch(error => {
                        console.error('Ошибка при удалении рецепта:', error);
                        document.getElementById("serverMessage").textContent = "Сервер недоступен. Пожалуйста, попробуйте позже.";
                    });
            }
        }

        function updateSelectedItem(item, listId) {
            if (listId === LIST_IDS.PRODUCTS) {
                const newName = prompt("Введите новое имя продукта:", item.name);
                const newTranslate = prompt("Введите новый перевод продукта:", item.translate);
                const newAlterName = prompt("Введите новую категорию продукта:", item.alterName);
                if (newName && newTranslate && newAlterName) {
                    updateAnything(`http://localhost:8080/api/product`, item.id, {
                        name: newName,
                        translate: newTranslate,
                        alterName: newAlterName
                    }).then(() => getProducts());
                }
            }
            else if (listId === LIST_IDS.RECIPES) {
                const newName = prompt("Введите новое имя рецепта:", item.name);
                const newTranslate = prompt("Введите новый перевод рецепта:", item.translate_of_recipe);
                const newAlterName = prompt("Введите новую категорию рецепта:", item.alter_name_of_recipe);
                const newRecipe = prompt("Введите новый рецепт:", item.recipe);
                if (newName && newTranslate && newAlterName && newRecipe) {
                    updateAnything(`http://localhost:8080/api/recipes`, item.idOfRecipe, {
                        name: newName,
                        translate_of_recipe: newTranslate,
                        alter_name_of_recipe: newAlterName,
                        recipe: newRecipe
                    }).then(() => getRecipes());
                }
            }
        }

        function updateAnything(url, id, data) {
            return fetch(`${url}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('Ошибка при обновлении:', error);
                    document.getElementById("serverMessage").textContent = "Сервер недоступен. Пожалуйста, попробуйте позже.";
                });
        }


        function deleteItem(url, id) {
            return fetch(`${url}/${id}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    return response.text();
                });
        }


        function postQueryUtility(url, data) {
            return fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    return response.text();
                });
        }

        function addProduct() {
            const product = {
                name: document.getElementById("nameOfProduct").value,
                translate: document.getElementById("translateOfProduct").value,
                alterName: document.getElementById("alterNameOfProduct").value
            };

            postQueryUtility("http://localhost:8080/api/product", product)
                .then(data => {
                    console.log(data);
                    getProducts();

                    document.getElementById("nameOfProduct").value = "";
                    document.getElementById("translateOfProduct").value = "";
                    document.getElementById("alterNameOfProduct").value = "";
                })
                .catch(error => {
                    console.error('Ошибка при получении данных:', error);
                    document.getElementById("serverMessage").textContent = "Сервер недоступен. Пожалуйста, попробуйте позже.";
                });
        }


        function addRecipe() {
            const recipe = {
                name: document.getElementById("nameOfRecipe").value,
                translate_of_recipe: document.getElementById("translateOfRecipe").value,
                alter_name_of_recipe: document.getElementById("alterNameOfRecipe").value,
                recipe: document.getElementById("recipe").value
            };

            postQueryUtility("http://localhost:8080/api/recipe", recipe)
                .then(data => {
                    console.log(data);
                    getRecipes();

                    document.getElementById("nameOfRecipe").value = "";
                    document.getElementById("translateOfRecipe").value = "";
                    document.getElementById("alterNameOfRecipe").value = "";
                    document.getElementById("recipe").value = "";
                })
                .catch(error => {
                    console.error('Ошибка при получении данных:', error);
                    document.getElementById("serverMessage").textContent = "Сервер недоступен. Пожалуйста, попробуйте позже.";
                });
        }
        window.onload = function () {
            getProducts();
            getRecipes();
        };