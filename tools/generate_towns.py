import json
import os

def generate_pages():
    # Ensure we are in the correct directory (tools/)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    # Load the template
    with open('town_template.html', 'r', encoding='utf-8') as f:
        template = f.read()

    # Load the town data
    with open('towns.json', 'r', encoding='utf-8') as f:
        towns = json.load(f)

    print(f"Loaded {len(towns)} towns from towns.json")

    # Generate each page
    for town in towns:
        html_content = template
        
        # Simple string replacement for all keys
        for key, value in town.items():
            html_content = html_content.replace(f"{{{{ {key} }}}}", value)
            # Also handle without spaces just in case
            html_content = html_content.replace(f"{{{{{key}}}}}", value)
            
        # Add the lowercase filter replacement for keywords
        html_content = html_content.replace(f"{{{{ town_name | lower }}}}", town['town_name'].lower())
        
        # Ensure district directory exists
        district_dir = os.path.join("..", town['district_slug'])
        if not os.path.exists(district_dir):
            os.makedirs(district_dir)
            print(f"Created directory: {district_dir}")

        # Write the file
        file_path = os.path.join(district_dir, f"{town['town_slug']}.html")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"Generated successfully: {file_path}")

if __name__ == "__main__":
    generate_pages()
    print("All hyper-local pages have been generated!")
