from flask import Flask, render_template, request, jsonify, redirect
from pinecone_embed import get_answer

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('chat.html')

conversations = []

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form['user_message']

    # Llama a la función get_answer para obtener la respuesta del chatbot
    bot_response = get_answer(user_message)
    #registra la conversación
    conversations.append({"user_message": user_message, "bot_response": bot_response})

    return jsonify({'bot_response': bot_response})

@app.route("/conversations", methods=["GET"])
def get_answered_conversations():
    # Devuelve las conversaciones como JSON
    return render_template("admin.html", answered=conversations)


@app.route("/delete_question", methods=["POST"])
def delete_question():
    question_to_delete = request.form.get("question")  # Obtiene la pregunta a eliminar desde el formulario

    # Busca la pregunta en la lista de preguntas y elimínala
    for conversation in conversations:
        if conversation["user_message"] == question_to_delete:
            conversations.remove(conversation)
            break

    return redirect("/conversations")

if __name__ == '__main__':
    app.run()

